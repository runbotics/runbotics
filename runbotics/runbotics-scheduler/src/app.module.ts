import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { StorageService } from './utils/storage.service';
import { Logger } from './utils/logger';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { MailModule } from './mail/mail.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
    imports: [
        AuthModule,
        DatabaseModule,
        QueueModule,
        MailModule,
        WebsocketModule,
    ],
    providers: [
        StorageService, Logger
    ],
})
export class AppModule { }
