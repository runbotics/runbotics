import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRegistrationWebhook } from '#/webhook/entities/client-registration-webhook.entity';
import { WebhookAuthorization } from '#/webhook/entities/webhook-authorization.entity';
import { WebhookPayload } from '#/webhook/entities/webhook-payload.entity';
import { WebhookIncomingEventLog } from '#/webhook/entities/webhook-incoming-event-log.entity';
import { WebhookProcessTrigger } from '#/webhook/entities/webhook-process-trigger.entity';
import { WebhookController } from '#/webhook/webhook.controller';
import { WebhookService } from '#/webhook/webhook.service';
import { HttpModule } from '@nestjs/axios';
import { EncryptionService } from '#/webhook/encryption.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ClientRegistrationWebhook,
            WebhookAuthorization,
            WebhookPayload,
            WebhookIncomingEventLog,
            WebhookProcessTrigger,
        ]),
        HttpModule,
    ],
    controllers: [WebhookController],
    providers: [WebhookService, EncryptionService],
})
export class WebhookModule {
}
