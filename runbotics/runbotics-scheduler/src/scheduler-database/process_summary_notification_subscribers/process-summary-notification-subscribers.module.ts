import { Module } from '@nestjs/common';
import {
    ProcessSummaryNotificationSubscribersService,
} from '#/scheduler-database/process_summary_notification_subscribers/process-summary-notification-subscribers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    ProcessSummaryNotificationSubscribersEntity,
} from '#/scheduler-database/process_summary_notification_subscribers/process-summary-notification-subscribers.entity';
import { ProcessStatisticsService } from '#/utils/process-statistics/process-statistics.service';
import { MailService } from '#/mail/mail.service';
import { ProcessInstanceModule } from '../process-instance/process-instance.module';
import { ProcessInstanceEventModule } from '../process-instance-event/process-instance-event.module';
import { BotModule } from '../bot/bot.module';
import { ProcessModule } from '../process/process.module';
import { NotificationProcessModule } from '../notification-process/notification-process.module';
import { NotificationBotModule } from '../notification-bot/notification-bot.module';
import {
    ProcessSummaryNotificationSubscribersController,
} from '#/scheduler-database/process_summary_notification_subscribers/process-summary-notification-subscribers.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessSummaryNotificationSubscribersEntity]),
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        BotModule,
        ProcessModule,
        NotificationProcessModule,
        NotificationBotModule,
    ],
    providers: [
        ProcessSummaryNotificationSubscribersService,
        ProcessStatisticsService,
        MailService,
    ],
    exports: [
        ProcessSummaryNotificationSubscribersService,
    ],
    controllers: [ProcessSummaryNotificationSubscribersController],
})
export class ProcessSummaryNotificationSubscribersModule {
}
