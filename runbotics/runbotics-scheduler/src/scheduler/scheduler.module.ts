import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import IORedis from 'ioredis';

import { ScheduleProcessController } from './schedule-process/schedule-process.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { BotController } from './bot/bot.controller';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { WebsocketModule } from '../websocket/websocket.module';
import { ProcessController } from './process/process.controller';
import { ProcessInstanceController } from './process-instance/process-instance.controller';
import { ConfigModule } from 'src/config/config.module';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { Logger } from 'src/utils/logger';
import { ProcessInstanceSchedulerService } from './process-instance/process-instance.scheduler.service';
import { ProcessSchedulerService } from './process/process.scheduler.service';
import { SchedulerProcessor } from './processor/scheduler.processor';
import { BotSchedulerService } from './bot/bot.scheduler.service';
import { TriggerController } from './trigger/process.controller';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        AuthModule,
        WebsocketModule,
        BullModule.registerQueueAsync({
            name: 'scheduler',
            imports: [ConfigModule],
            useFactory: async (serverConfigService: ServerConfigService) => {
                return {
                    createClient: (_, redisOpts) => {
                        const logger = new Logger(BullModule.name);
                        const customRedisOpts = { ...redisOpts, ...serverConfigService.redisSettings };
                        const redis = new IORedis(customRedisOpts);
                        redis.on('error', async (err) => {
                            logger.error('Redis error', err);
                        });
                        redis.on('connect', () => {
                            logger.log('Redis connected');
                        });
                        return redis;
                    },
                };
            },
            inject: [ServerConfigService],
        })
    ],
    controllers: [
        SchedulerController, ProcessController, ProcessInstanceController, BotController, ScheduleProcessController, TriggerController
    ],
    providers: [
        SchedulerService, ServerConfigService, SchedulerProcessor, ProcessSchedulerService,
        ProcessInstanceSchedulerService, BotSchedulerService
    ]
})
export class SchedulerModule { }
