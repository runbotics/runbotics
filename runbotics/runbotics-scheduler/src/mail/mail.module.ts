import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseModule } from 'src/database/database.module';
import { QueueModule } from 'src/queue/queue.module';
import { MailService } from './mail.service';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule,
        QueueModule,
        ScheduleModule.forRoot(),
    ],
    providers: [
        MailService
    ],
})
export class MailModule {}
