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

@Module({
    imports: [
        DatabaseModule,
        SecretModule,
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
        TriggerEventModule,
    ],
    exports: [
        DatabaseModule,
        ProcessInstanceModule,
        ProcessInstanceEventModule,
        ProcessInstanceLoopEventModule,
    ],
})
export class SchedulerDatabaseModule {}
