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

@Module({
    imports: [
        DatabaseModule,
        SecretModule,
        ProcessContextModule,
        ProcessContextSecretModule,
        TenantModule,
        GlobalVariableModule,
        NotificationBotModule,
        NotificationProcessModule,
        TagModule
    ],
    exports: [],
})
export class SchedulerDatabaseModule { }
