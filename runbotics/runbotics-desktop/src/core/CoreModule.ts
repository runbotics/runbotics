import { Module } from '@nestjs/common';
import { RuntimeService } from './bpm/Runtime';
import { ServerConfigService } from '../config/ServerConfigService';
import { StorageService } from '../config/StorageService';
import { RunboticsLogger } from '../logger/RunboticsLogger';
import { ProcessListener } from './websocket/listeners/Process.listener';
import { RuntimeSubscriptionsService } from './websocket/bpmn/RuntimeSubscriptions.service';
import { AuthService } from './websocket/auth/Auth.service';
import { WebsocketService } from './websocket/Websocket.service';
import { WebsocketModule } from './websocket/Websocket.module';
import { ConfigModule } from '../config/RunBoticsConfigModule';
import { WebsoketLogs } from './websocket/WebsocketLogs.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    controllers: [ProcessListener],
    providers: [
        RuntimeService,
        StorageService,
        ServerConfigService,
        RunboticsLogger,
        RuntimeSubscriptionsService,
        AuthService,
        WebsocketService,
        WebsoketLogs
    ],
    imports: [WebsocketModule, ConfigModule, ScheduleModule.forRoot()],
    exports: [RuntimeService, StorageService],
})
export class CoreModule {}
