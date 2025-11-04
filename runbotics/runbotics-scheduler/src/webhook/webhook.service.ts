import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { RequestType, WebhookAuthorizationType } from 'runbotics-common';
import bcrypt from 'bcryptjs';
import { HttpService } from '@nestjs/axios';
import { parseAuthorization, replacePlaceholderImmutable } from '#/webhook/webhook-service.utils';
import { EncryptionService } from '#/webhook/encryption.service';
import { ServerConfigService } from '#/config/server-config';
import { inspect } from 'node:util';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WebhookService {
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
                    acc[key] = bcrypt.hashSync(value, 10);
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
            console.log(typeof registrationPayload, registrationPayload);
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
            
            const registrationPayloadWithUrl = replacePlaceholderImmutable(
                JSON.parse(newWebhookEntry.registrationPayload as unknown as string),
                '{{webhook}}',
                `${this.serverConfigService.entrypointUrl}/api/scheduler/webhook`,
            );
            const headers = {
                'Content-Type': 'application/json',
                ...(await parseAuthorization(newClientAuth, this.encryptionService)),
            };
            console.log(
                'Sending request with data',
                headers,
                registrationPayloadWithUrl,
                newWebhookEntry.applicationURL,
                typeof newWebhookEntry.registrationPayload,
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
                        headers,
                        ...registrationPayloadWithUrl,
                    }));
                    break;
                case RequestType.PUT:
                    response = await firstValueFrom(this.httpService.put(newWebhookEntry.applicationURL, {
                        headers,
                        ...registrationPayloadWithUrl,
                    }));
                    break;
                case RequestType.PATCH:
                    response = await firstValueFrom(this.httpService.patch(newWebhookEntry.applicationURL, {
                        headers,
                        ...registrationPayloadWithUrl,
                    }));
                    break;
            }
            console.log(inspect(response, { depth: 6 }));

            return newWebhookEntry;
        });

        //TODO: implement registration of webhook in client application
        return transactionResult;
    }
}
