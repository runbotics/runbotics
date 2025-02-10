import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '#/database/database.module';
import { QueueModule } from '#/queue/queue.module';
import { MailTriggerService } from './mail-trigger.service';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';

@Module({
    imports: [
        DatabaseModule,
        QueueModule,
        ScheduleModule.forRoot(),
        TenantModule,
    ],
    providers: [MailTriggerService],
    exports: [MailTriggerService],
})
export class MailTriggerModule {}
