import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { AuthModule } from '../auth/auth.module';
import { BotProcessEventService } from './process-launch/bot-process-event.service';
import { BotProcessService } from './process-launch/bot-process.service';
import { BotLogService } from './bot-log/bot-log.service';
import { BotWebSocketGateway } from './gateway/bot.gateway';
import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { UiGateway } from './gateway/ui.gateway';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        ConfigModule
    ],
    providers: [
        BotWebSocketGateway, UiGateway, BotLogService, BotProcessService, BotProcessEventService, WebsocketService,
    ],
    exports: [
        BotWebSocketGateway, UiGateway, BotLogService, BotProcessService, BotProcessEventService, WebsocketService,
    ]
})
export class WebsocketModule {}
