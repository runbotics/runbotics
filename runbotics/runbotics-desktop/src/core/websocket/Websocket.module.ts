import { Module } from '@nestjs/common';
import { IoClientModule } from 'nestjs-io-client';
import { ConfigModule } from '../../config/RunBoticsConfigModule';
import { ServerConfigService } from '../../config/ServerConfigService';
import { AuthService } from './auth/Auth.service';
import { RunboticsLogger } from '../../logger/RunboticsLogger';
import { RuntimeService } from '../bpm/Runtime';

@Module({
    imports: [
        IoClientModule.forRootAsync({
            imports: [ConfigModule],
            providers: [AuthService],
            inject: [ServerConfigService, AuthService],
            useFactory: async (config: ServerConfigService, auth: AuthService) => {
                const logger = new RunboticsLogger(WebsocketModule.name);
                const schedulerServer = new URL(config.entrypointUrl);
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
    ],
    providers: [RuntimeService],
})
export class WebsocketModule { }
