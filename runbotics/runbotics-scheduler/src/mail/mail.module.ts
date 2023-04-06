import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '#/database/database.module';
import { QueueModule } from '#/queue/queue.module';
import { MailService } from './mail.service';

@Module({
    imports: [
        DatabaseModule,
        QueueModule,
        ScheduleModule.forRoot(),
    ],
    providers: [
        MailService
    ],
    exports: [MailService],
})
export class MailModule {}
