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
import { BullModule } from '@nestjs/bull';
import { QueueModule } from '#/queue/queue.module';
import { WebhooksProcessor } from '#/webhook/webhook.processor';
import { ConfigModule } from '#/config/config.module';
import { ServerConfigService } from '#/config/server-config';
import { Logger } from '#/utils/logger';
import IORedis from 'ioredis';

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
        BullModule.registerQueueAsync({
            name: 'webhooks',
            imports: [ ConfigModule ],
            inject: [ ServerConfigService ],
            useFactory: (serverConfigService: ServerConfigService) => ({
                createClient: (_, redisOpts) => {
                    const logger = new Logger(BullModule.name);
                    const redis = new IORedis({ ...redisOpts, ...serverConfigService.redisSettings });

                    redis.on('error', async (err) => {
                        logger.error('Redis error', err);
                    });
                    redis.on('connect', () => {
                        logger.log('Redis connected');
                    });

                    return redis;
                },
            }),
        }),
        QueueModule,
    ],
    controllers: [WebhookController],
    providers: [WebhookService, EncryptionService, WebhooksProcessor],
})

export class WebhookModule {
}
