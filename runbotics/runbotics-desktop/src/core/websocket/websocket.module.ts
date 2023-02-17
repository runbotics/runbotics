import { forwardRef, Module } from '@nestjs/common';
import { IoClientModule } from 'nestjs-io-client';
import { AuthService } from './auth/auth.service';

import { ConfigModule, ServerConfigService } from '#config';
import { CoreModule } from '#core';
import { RunboticsLogger } from '#logger';

import { ProcessListener } from './listeners/process.listener';
import { WebsocketLogsService } from './websocket-logs.service';
import { WebsocketService } from './websocket.service';

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
        WebsocketService,
    ],
})
export class WebsocketModule {}
