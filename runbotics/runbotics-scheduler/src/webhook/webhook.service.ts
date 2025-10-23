import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateClientRegistrationWebhookDto } from '#/webhook/dto/client-registration-webhook.dto';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { WebhookAuthorizationType } from 'runbotics-common';
import bcrypt from 'bcryptjs';

@Injectable()
export class WebhookService {
    constructor(
        private readonly dataSource: DataSource,
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
            const { name, applicationUrl, active, clientAuthorization, payload, registrationPayload } = webhookDto;

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

            const newWebhookEntry = await manager.save(ClientRegistrationWebhook, {
                name,
                applicationURL: applicationUrl,
                active,
                tenantId,
                clientAuthorization: newClientAuth,
                authorization: newAuth,
                payload: newPayload,
                registrationPayload,
            });

            return newWebhookEntry;
        });

        //TODO: implement registration of webhook in client application
        return transactionResult;
    }
}
