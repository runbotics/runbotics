import { Global, Module } from '@nestjs/common';

import { QueueModule } from '#/queue/queue.module';
import { MicrosoftModule } from '#/microsoft';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { BotProcessService } from './bot/process-launch/bot-process-instance.service';
import { BotProcessEventService } from './bot/process-launch/bot-process-instance-event.service';
import { BotLogService } from './bot/bot-log.service';
import { BotWebSocketGateway } from './bot/bot.gateway';
import { WebsocketService } from './websocket.service';
import { UiGateway } from './ui/ui.gateway';
import { BotLifecycleService } from './bot/bot-lifecycle.service';
import { Logger } from 'src/utils/logger';
import { NestMailerModule } from '#/nest-mailer/nest-mailer.module';
import { ProcessModule } from '#/database/process/process.module';

@Global()
@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        MailModule,
        QueueModule,
        MicrosoftModule,
        NestMailerModule,
        ProcessModule,
    ],
    providers: [
        BotWebSocketGateway, 
        UiGateway, 
        BotLogService, 
        BotProcessService, 
        BotProcessEventService, 
        WebsocketService, 
        BotLifecycleService, 
        Logger
    ],
    exports: [
        BotWebSocketGateway, UiGateway, BotLogService, WebsocketService,
    ]
})
export class WebsocketModule {}
