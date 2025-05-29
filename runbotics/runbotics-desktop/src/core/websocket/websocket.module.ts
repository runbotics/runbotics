import { forwardRef, Module } from '@nestjs/common';
import { IoClientModule } from 'nestjs-io-client';
import { WebSocketAuthService } from './auth/webSocketAuth.service';

import { ConfigModule, ServerConfigService } from '#config';
import { CoreModule } from '#core';
import { RunboticsLogger } from '#logger';

import { ProcessListener } from './listeners/process.listener';
import { WebsocketLogsService } from './websocket-logs.service';
import { WebsocketService } from './websocket.service';
import { MessageQueueService } from './queue/message-queue.service';
import { LoopHandlerService } from '#core/bpm/loop-handler';
import { RuntimeSubscriptionsService } from './bpmn/runtime-subscriptions.service';
import { AuthModule } from '#core/auth/auth.module';


@Module({
    imports: [
        AuthModule,
        IoClientModule.forRootAsync({
            imports: [ConfigModule, AuthModule],
            providers: [WebSocketAuthService],
            inject: [ServerConfigService, WebSocketAuthService],
            useFactory: async (config: ServerConfigService, auth: WebSocketAuthService) => {
                const logger = new RunboticsLogger(WebsocketModule.name);
                const schedulerServer = new URL(config.entrypointSchedulerUrl);
                const wsUrl = `${schedulerServer.protocol == 'https:' ? 'wss' : 'ws'}://${schedulerServer.host}`;
                logger.log(`Connecting with Scheduler (url: ${wsUrl})`);
                const credentials = await auth.getWebSocketCredentials();
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
        WebSocketAuthService,
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
