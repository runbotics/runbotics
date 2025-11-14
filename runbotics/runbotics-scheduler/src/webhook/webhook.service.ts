import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { RequestType, WebhookAuthorizationType } from 'runbotics-common';
import { HttpService } from '@nestjs/axios';
import { parseAuthorization, replacePlaceholdersImmutable } from '#/webhook/webhook-service.utils';
import { EncryptionService } from '#/webhook/encryption.service';
import { ServerConfigService } from '#/config/server-config';
import { firstValueFrom } from 'rxjs';
import { Logger } from '#/utils/logger';
import { WebhookProcessTrigger } from '#/webhook/entities/webhook-process-trigger.entity';
import { WebhookIncomingEventLog } from '#/webhook/entities/webhook-incoming-event-log.entity';
import { DeleteClientRegistrationWebhookDto } from './dto/client-unregistration-webhook.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';

interface AxiosRequestConfigParams {
    requestType: RequestType;
    url: string;
    payload: Record<string, unknown>;
    authorization: WebhookAuthorization;
}

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly httpService: HttpService,
        private readonly encryptionService: EncryptionService,
        private readonly serverConfigService: ServerConfigService,
        @InjectRepository(ClientRegistrationWebhook)
        private readonly clientRegistrationWebhookRepository: Repository<ClientRegistrationWebhook>
    ) {}

    async get(tenantId: string): Promise<ClientRegistrationWebhook[]> {
        return this.dataSource.manager.find(ClientRegistrationWebhook, {
            where: { tenantId },
            relations: {
                clientAuthorization: true,
                payload: true
            }
        });
    }

    async createWebhookEntry(tenantId: string, webhookDto: CreateClientRegistrationWebhookDto) {
        const manager = this.dataSource.manager;
        const transactionResult = await manager.transaction(async manager => {
            const { name, applicationUrl, applicationRequestType, active, clientAuthorization, payload, registrationPayload } = webhookDto;

            const clientAuthDataHashed =
                clientAuthorization.type !== WebhookAuthorizationType.NONE
                    ? {
                          type: clientAuthorization.type,
                          data: Object.values(clientAuthorization.data).reduce((acc, value, index) => {
                              const key = Object.keys(clientAuthorization.data)[index];
                              acc[key] = this.encryptionService.encrypt(value);
                              return acc;
                          }, {})
                      }
                    : {
                          type: WebhookAuthorizationType.NONE
                      };
            const newAuth = await manager.save(WebhookAuthorization, {
                type: WebhookAuthorizationType.JWT
            });
            const newClientAuth = await manager.save(WebhookAuthorization, clientAuthDataHashed);

            const newPayload = await manager.save(WebhookPayload, payload);

            const newWebhookEntry = await manager.save(ClientRegistrationWebhook, {
                name,
                applicationURL: applicationUrl,
                applicationRequestType,
                active,
                tenantId,
                clientAuthorization: newClientAuth,
                authorization: newAuth,
                payload: newPayload,
                registrationPayload: registrationPayload
            });

            const registrationPayloadWithUrl = replacePlaceholdersImmutable(
                JSON.parse(newWebhookEntry.registrationPayload as unknown as string),
                {
                    '{{webhook}}': `${this.serverConfigService.entrypointUrl}/api/scheduler/webhook`,
                    '{{webhookId}}': newWebhookEntry.id
                }
            );

            const axiosRequestConfig: AxiosRequestConfigParams = {
                requestType: newWebhookEntry.applicationRequestType,
                url: newWebhookEntry.applicationURL,
                authorization: newClientAuth,
                payload: registrationPayloadWithUrl
            };

            await this.getAxiosResponse(axiosRequestConfig);

            return newWebhookEntry;
        });

        return transactionResult;
    }

    async deleteWebhookEntry(tenantId: string, webhookId: string, webhookDto: DeleteClientRegistrationWebhookDto) {
        const webhook = await this.clientRegistrationWebhookRepository.findOne({
            where: { id: webhookId, tenantId },
            relations: ['authorization', 'clientAuthorization', 'webhookProcessTriggers', 'payload']
        });

        if (!webhook) throw new NotFoundException();

        const authorization = webhook.clientAuthorization;

        const axiosConfigParams = {
            requestType: webhookDto.applicationRequestType,
            authorization,
            url: webhookDto.applicationUrl,
            payload: webhookDto.unregisterPayload
        };

        const response = await this.getAxiosResponse(axiosConfigParams).catch(error => {
            if (error && error.response && error.status) {
                throw new BadRequestException(
                    `Unregistration failed, status code: ${error.response.status}, status message: ${error.response.statusText}`
                );
            } else {
                throw new BadRequestException();
            }
        });

        const wasRequestSuccessful = this.checkIsResponseSuccess(webhookDto.applicationRequestType, response.status);

        if (!wasRequestSuccessful) {
            throw new BadRequestException(`Unregistration failed, status code: ${response.status}, status message: ${response.statusText}`);
        }

        this.logger.log(`Unregistration success with status code: ${response.status}.`);

        return await this.dataSource.transaction(async manager => {
            const triggerIds = webhook.webhookProcessTriggers.map(trigger => trigger.id);

            if (triggerIds.length > 0) {
                await manager.delete(WebhookProcessTrigger, { id: In(webhook.webhookProcessTriggers.map(trigger => trigger.id)) });
            }

            await manager.delete(ClientRegistrationWebhook, { id: webhook.id });

            await manager.delete(WebhookAuthorization, { id: webhook.clientAuthorization.id });

            await manager.delete(WebhookAuthorization, { id: webhook.authorization.id });

            if (webhook.payload?.id) {
                await manager.delete(WebhookPayload, { id: webhook.payload.id });
            }
        });
    }

    async processWebhook(body: Record<string, unknown>): Promise<any> {
        this.logger.log(`Processing webhook ${JSON.stringify(body)}`);
        await this.dataSource.manager.save(WebhookIncomingEventLog, {
            authorization: WebhookAuthorizationType.JWT,
            payload: JSON.stringify(body),
            status: 'Incoming'
        });
        if (!body.webhoookId || typeof body.webhookId !== 'string') {
            await this.dataSource.manager.save(WebhookIncomingEventLog, {
                authorization: WebhookAuthorizationType.JWT,
                payload: JSON.stringify(body),
                status: 'Error',
                error: 'No webhook id provided.'
            });
            this.logger.warn('Processing webhook trigger failed. No webhook ID found.');
        }
        const transaction = await this.dataSource.transaction(async manager => {
            const triggers = await manager.findBy(WebhookProcessTrigger, { webhookId: body.webhookId as string });

            for (const trigger of triggers) {
                this.logger.log(`Triggering process ${trigger.processId}`);
            }
        });
    }

    private async getAxiosResponse(configParams: AxiosRequestConfigParams) {
        const { requestType, authorization, url, payload } = configParams;

        const headers = {
            'Content-Type': 'application/json',
            ...(await parseAuthorization(authorization, this.encryptionService))
        };

        let response: AxiosResponse;
        switch (requestType) {
            case RequestType.GET:
                response = await firstValueFrom(
                    this.httpService.get(url, {
                        headers
                    })
                );
                break;
            case RequestType.POST:
                response = await firstValueFrom(
                    this.httpService.post(
                        url,
                        {
                            ...payload
                        },
                        {
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                );
                break;
            case RequestType.PUT:
                response = await firstValueFrom(
                    this.httpService.put(
                        url,
                        {
                            ...payload
                        },
                        {
                            headers: {
                                ...headers,
                                'Content-Type': 'application/json'
                            }
                        }
                    )
                );
                break;
            case RequestType.PATCH:
                response = await firstValueFrom(
                    this.httpService.patch(
                        url,
                        {
                            ...payload
                        },
                        {
                            headers
                        }
                    )
                );
                break;
            case RequestType.DELETE:
                response = await firstValueFrom(
                    this.httpService.delete(url, {
                        headers
                    })
                );
                break;
        }

        return response;
    }

    private checkIsResponseSuccess(requestType: RequestType, status: number): boolean {
        const successStatusMap: Record<RequestType, number[]> = {
            [RequestType.GET]: [200],
            [RequestType.POST]: [200, 201],
            [RequestType.PUT]: [200, 201, 204],
            [RequestType.PATCH]: [200, 204],
            [RequestType.DELETE]: [200, 204, 202]
        };

        const validStatuses = successStatusMap[requestType];
        return validStatuses.includes(status);
    }
}
