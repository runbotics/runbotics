import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
} from '#/scheduler-database/process-summary-notification-subscribers/process-summary-notification-subscribers.controller';
import { ProcessSummaryNotificationSubscribersService } from './process-summary-notification-subscribers.service';
import { ProcessSummaryNotificationSubscribersEntity } from './process-summary-notification-subscribers.entity';
import { UnsubscribeTokenModule } from '../unsubscribe-token/unsubscribe-token.module';
import { I18nService } from '#/mail/i18n.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessSummaryNotificationSubscribersEntity]),
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        BotModule,
        ProcessModule,
        NotificationProcessModule,
        NotificationBotModule,
        UnsubscribeTokenModule,
    ],
    providers: [
        ProcessSummaryNotificationSubscribersService,
        ProcessStatisticsService,
        MailService,
        I18nService,
    ],
    exports: [
        ProcessSummaryNotificationSubscribersService,
    ],
    controllers: [ProcessSummaryNotificationSubscribersController],
})
export class ProcessSummaryNotificationSubscribersModule {
}
