import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { RequestType, WebhookAuthorizationType } from 'runbotics-common';
import { HttpService } from '@nestjs/axios';
import { parseAuthorization, replacePlaceholdersImmutable } from '#/webhook/webhook-service.utils';
import { EncryptionService } from '#/webhook/encryption.service';
import { ServerConfigService } from '#/config/server-config';
import { inspect } from 'node:util';
import { firstValueFrom } from 'rxjs';
import { Logger } from '#/utils/logger';
import { WebhookProcessTrigger } from '#/webhook/entities/webhook-process-trigger.entity';
import { WebhookIncomingEventLog } from '#/webhook/entities/webhook-incoming-event-log.entity';

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly httpService: HttpService,
        private readonly encryptionService: EncryptionService,
        private readonly serverConfigService: ServerConfigService,
    ) {
    }

    async get(tenantId: string): Promise<ClientRegistrationWebhook[]> {
        return this.dataSource.manager.find(ClientRegistrationWebhook, {
            where: { tenantId }, relations: {
                clientAuthorization: true,
                payload: true,
            },
        });
    }

    async createWebhookEntry(tenantId: string, webhookDto: CreateClientRegistrationWebhookDto) {
        const manager = this.dataSource.manager;
        const transactionResult = await manager.transaction(async (manager) => {
            const {
                name,
                applicationUrl,
                applicationRequestType,
                active,
                clientAuthorization,
                payload,
                registrationPayload,
            } = webhookDto;

            const clientAuthDataHashed = clientAuthorization.type !== WebhookAuthorizationType.NONE ? {
                type: clientAuthorization.type,
                data: Object.values(clientAuthorization.data).reduce((acc, value, index) => {
                    const key = Object.keys(clientAuthorization.data)[index];
                    acc[key] = this.encryptionService.encrypt(value);
                    return acc;
                }, {}),
            } : {
                type: WebhookAuthorizationType.NONE,
            };
            const newAuth = await manager.save(WebhookAuthorization, {
                type: WebhookAuthorizationType.JWT,
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
                registrationPayload: registrationPayload,
            });

            const registrationPayloadWithUrl = replacePlaceholdersImmutable(
                JSON.parse(newWebhookEntry.registrationPayload as unknown as string),
                {
                    '{{webhook}}': `${this.serverConfigService.entrypointUrl}/api/scheduler/webhook`,
                    '{{webhookId}}': newWebhookEntry.id,
                },
            );
            const headers = {
                'Content-Type': 'application/json',
                ...(await parseAuthorization(newClientAuth, this.encryptionService)),
            };
            console.log(
                'Sending request with data',
                headers,
                registrationPayloadWithUrl,
            );
            let response;
            switch (newWebhookEntry.applicationRequestType) {
                case RequestType.GET:
                    response = await firstValueFrom(this.httpService.get(newWebhookEntry.applicationURL, {
                        headers,
                    }));
                    break;
                case RequestType.POST:
                    response = await firstValueFrom(this.httpService.post(newWebhookEntry.applicationURL, {
                        ...registrationPayloadWithUrl,
                    }, {
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                        },
                    }));
                    break;
                case RequestType.PUT:
                    response = await firstValueFrom(this.httpService.put(newWebhookEntry.applicationURL, {
                        ...registrationPayloadWithUrl,
                    }, {
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                        },
                    }));
                    break;
                case RequestType.PATCH:
                    response = await firstValueFrom(this.httpService.patch(newWebhookEntry.applicationURL, {

                        ...registrationPayloadWithUrl,
                    }, {
                        headers,
                    }));
                    break;
            }
            console.log(inspect(response, { depth: 6 }));

            return newWebhookEntry;
        });

        return transactionResult;
    }

    async processWebhook(body: Record<string, unknown>): Promise<any> {
        this.logger.log(`Processing webhook ${JSON.stringify(body)}`);
        await this.dataSource.manager.save(WebhookIncomingEventLog, {
            authorization: WebhookAuthorizationType.JWT,
            payload: JSON.stringify(body),
            status: 'Incoming',
        });
        if (!body.webhoookId || typeof body.webhookId !== 'string') {
            await this.dataSource.manager.save(WebhookIncomingEventLog, {
                authorization: WebhookAuthorizationType.JWT,
                payload: JSON.stringify(body),
                status: 'Error',
                error: 'No webhook id provided.',
            });
            this.logger.warn('Processing webhook trigger failed. No webhook ID found.');
        }
        const transaction = await this.dataSource.transaction(async (manager) => {
            const triggers = await manager.findBy(WebhookProcessTrigger, { webhookId: body.webhookId as string });

            for (const trigger of triggers) {
                this.logger.log(`Triggering process ${trigger.processId}`);
            }
        });
    }
}
