import { ConfigModule } from '#/config/config.module';
import { ServerConfigService } from '#/config/server-config/server-config.service';
import { MicrosoftModule } from '#/microsoft';
import { Logger } from '#/utils/logger';
import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import IORedis from 'ioredis';
import { ProcessInputService } from 'src/queue/process/process-input.service';
import { AuthModule } from '../auth/auth.module';
import { BotController } from './bot/bot.controller';
import { BotSchedulerService } from './bot/bot.scheduler.service';
import { ProcessInstanceController } from './process-instance/process-instance.controller';
import { ProcessInstanceSchedulerService } from './process-instance/process-instance.scheduler.service';
import { ProcessFileService } from './process/process-file.service';
import { ProcessSchedulerService } from './process/process-scheduler.service';
import { ProcessController } from './process/process.controller';
import { SchedulerProcessor } from './processor/scheduler.processor';
import { QueueService } from './queue.service';

import { SchedulerController } from './scheduler/scheduler.controller';
import { SchedulerService } from './scheduler/scheduler.service';
import { TriggerController } from './trigger/trigger.controller';
import { ProcessGuestService } from './process/process-guest.service';
import { QueueMessageService } from './queue-message.service';
import { ScheduleProcessModule } from '#/scheduler-database/schedule-process/schedule-process.module';
import { SecretModule } from '#/scheduler-database/secret/secret.module';
import { SchedulerDatabaseModule } from '#/scheduler-database/scheduler-database.module';
import { BlacklistActionAuthModule } from '#/blacklist-actions-auth/blacklist-action-auth.module';

@Module({
    imports: [
        SecretModule,
        SchedulerDatabaseModule,
        AuthModule,
        MicrosoftModule,
        BullModule.registerQueueAsync({
            name: 'scheduler',
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
        forwardRef(() => ScheduleProcessModule),
        BlacklistActionAuthModule,
    ],
    controllers: [
        SchedulerController, ProcessController, ProcessInstanceController, BotController, TriggerController,
    ],
    providers: [
        SchedulerService, SchedulerProcessor, ProcessSchedulerService, ProcessFileService, ProcessInputService,
        ProcessInstanceSchedulerService, BotSchedulerService, QueueService, ProcessGuestService, QueueMessageService,
    ],
    exports: [ QueueService, ProcessFileService, ProcessGuestService ],
})
export class QueueModule {
}
