import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '#/database/database.module';
import { QueueModule } from '#/queue/queue.module';
import { MailTriggerService } from './mail-trigger.service';

@Module({
    imports: [
        DatabaseModule,
        QueueModule,
        ScheduleModule.forRoot(),
    ],
    providers: [MailTriggerService],
    exports: [MailTriggerService],
})
export class MailTriggerModule {}
