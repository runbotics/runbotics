import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

import { BotProcessEventService } from './process-launch/bot-process-event.service';
import { BotProcessService } from './process-launch/bot-process.service';
import { BotLogService } from './bot-log/bot-log.service';
import { BotWebSocketGateway } from './gateway/bot.gateway';
import { WebsocketService } from './websocket.service';
import { UiGateway } from './gateway/ui.gateway';
import { MicrosoftModule } from 'src/microsoft/microsoft.module';

@Global()
@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        MailModule,
        MicrosoftModule,
    ],
    providers: [
        BotWebSocketGateway, UiGateway, BotLogService, BotProcessService, BotProcessEventService, WebsocketService,
    ],
    exports: [
        BotWebSocketGateway, UiGateway, BotLogService, BotProcessService, BotProcessEventService, WebsocketService,
    ]
})
export class WebsocketModule { }
