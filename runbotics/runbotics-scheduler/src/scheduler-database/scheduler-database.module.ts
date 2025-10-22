import { Module } from '@nestjs/common';
import { SecretModule } from '#/scheduler-database/secret/secret.module';
import { ProcessContextModule } from '#/scheduler-database/process-context/process-context.module';
import { ProcessContextSecretModule } from '#/scheduler-database/process-context-secret/process-context-secret.module';
import { DatabaseModule } from '#/database/database.module';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';
import { GlobalVariableModule } from './global-variable/global-variable.module';
import { NotificationBotModule } from './notification-bot/notification-bot.module';
import { NotificationProcessModule } from './notification-process/notification-process.module';
import { TagModule } from './tags/tag.module';
import { CredentialModule } from './credential/credential.module';
import { CredentialCollectionModule } from '#/scheduler-database/credential-collection/credential-collection.module';
import { CredentialCollectionUserModule } from './credential-collection-user/credential-collection-user.module';
import { FeatureKeyModule } from './feature-key/feature-key.module';
import { AuthorityModule } from './authority/authority.module';
import { ActionModule } from './action/action.module';
import { ProcessCredentialModule } from './process-credential/process-credential.module';
import { ScheduleProcessModule } from './schedule-process/schedule-process.module';
import { CredentialAttributeModule } from './credential-attribute/credential-attribute.module';
import { ProcessOutputModule } from './process-output/process-output.module';
import { ProcessInstanceModule } from './process-instance/process-instance.module';
import { ProcessInstanceEventModule } from './process-instance-event/process-instance-event.module';
import { ProcessInstanceLoopEventModule } from './process-instance-loop-event/process-instance-loop-event.module';
import { TriggerEventModule } from './trigger-event/trigger-event.module';
import { UserModule } from './user/user.module';
import { GuestModule } from '#/scheduler-database/guest/guest.module';
import { ProcessCollectionModule } from './process-collection/process-collection.module';
import { EmailTriggerWhitelistItemModule } from './email-trigger-whitelist-item/email-trigger-whitelist-item.module';
import { LicenseModule } from './license/license.module';
import { ProcessSummaryNotificationSubscribersModule } from './process-summary-notification-subscribers/process-summary-notification-subscribers.module';
import { ActionBlacklistModule } from '#/scheduler-database/action-blacklist/action-blacklist.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UnsubscribeTokenModule } from './unsubscribe-token/unsubscribe-token.module';
import { AccountModule } from './account/account.module';

@Module({
    imports: [
        DatabaseModule,
        SecretModule,
        ScheduleModule.forRoot(),
        ProcessContextModule,
        ProcessContextSecretModule,
        ProcessCredentialModule,
        TenantModule,
        GlobalVariableModule,
        NotificationBotModule,
        NotificationProcessModule,
        TagModule,
        CredentialCollectionModule,
        CredentialCollectionUserModule,
        CredentialModule,
        FeatureKeyModule,
        AuthorityModule,
        ActionModule,
        ScheduleProcessModule,
        CredentialAttributeModule,
        ProcessOutputModule,
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        ProcessInstanceLoopEventModule,
        UserModule,
        TriggerEventModule,
        GuestModule,
        ProcessCollectionModule,
        EmailTriggerWhitelistItemModule,
        LicenseModule,
        ActionBlacklistModule,
        ProcessSummaryNotificationSubscribersModule,
        UnsubscribeTokenModule,
        AccountModule,
    ],
    exports: [
        DatabaseModule,
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        ProcessInstanceLoopEventModule,
        UserModule,
        GuestModule,
        ProcessCollectionModule,
    ],
})
export class SchedulerDatabaseModule {}
