import { forwardRef, Module } from '@nestjs/common';
import { IoClientModule } from 'nestjs-io-client';
import { AuthService } from './auth/auth.service';

import { ConfigModule, ServerConfigService } from '#config';
import { CoreModule } from '#core';
import { RunboticsLogger } from '#logger';

import { ProcessListener } from './listeners/process.listener';
import { WebsocketLogsService } from './websocket-logs.service';
import { WebsocketService } from './websocket.service';
import { MessageQueueService } from './queue/message-queue.service';
import { LoopHandlerService } from '#core/bpm/loop-handler';
import { RuntimeSubscriptionsService } from './bpmn/runtime-subscriptions.service';


@Module({
    imports: [
        IoClientModule.forRootAsync({
            imports: [ConfigModule],
            providers: [AuthService],
            inject: [ServerConfigService, AuthService],
            useFactory: async (config: ServerConfigService, auth: AuthService) => {
                const logger = new RunboticsLogger(WebsocketModule.name);
                const schedulerServer = new URL(config.entrypointSchedulerUrl);
                const wsUrl = `${schedulerServer.protocol == 'https:' ? 'wss' : 'ws'}://${schedulerServer.host}`;
                logger.log(`Connecting with Scheduler (url: ${wsUrl})`);
                const credentials = await auth.getCredentials();
                return {
                    uri: wsUrl,
                    options: {
                        auth: credentials,
                        path: '/ws-bot/',
                        reconnectionDelayMax: 10000,
                        // transports: [
                        //     'websocket'
                        // ]
                    },
                };
            },
        }),
        forwardRef(() => CoreModule),
    ],
    providers: [
        AuthService,
        ProcessListener,
        WebsocketLogsService,
        LoopHandlerService,
        MessageQueueService,
        WebsocketService,
        RuntimeSubscriptionsService,
    ],
    exports: [
        WebsocketService
    ]
})
export class WebsocketModule { }
