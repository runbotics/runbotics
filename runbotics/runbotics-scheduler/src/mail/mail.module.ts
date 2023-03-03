import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from 'src/database/database.module';
import { QueueModule } from 'src/queue/queue.module';
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
