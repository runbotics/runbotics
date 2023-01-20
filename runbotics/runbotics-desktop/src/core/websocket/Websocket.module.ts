import { forwardRef, Module } from '@nestjs/common';
import { IoClientModule } from 'nestjs-io-client';
import { ConfigModule } from '../../config/config.module';
import { ServerConfigService } from '../../config/server-config.service';
import { AuthService } from './auth/auth.service';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import { ProcessListener } from './listeners/process.listener';
import { WebsocketLogs } from './websocket-logs.service';
import { WebsocketService } from './websocket.service';
import { RuntimeSubscriptionsService } from './bpmn/runtime-subscriptions.service';
import { CoreModule } from '#core/core.module';

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
        WebsocketLogs,
        WebsocketService,
        RuntimeSubscriptionsService,
    ],
})
export class WebsocketModule {}
