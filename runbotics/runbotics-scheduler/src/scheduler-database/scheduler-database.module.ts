import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServerConfigService } from '#/config/server-config';
import { ConfigModule } from '#/config/config.module';
import { SecretModule } from '#/scheduler-database/secret/secret.module';
import { ProcessContextModule } from '#/scheduler-database/process-context/process-context.module';
import { ProcessContextSecretModule } from '#/scheduler-database/process-context-secret/process-context-secret.module';
import { DatabaseModule } from '#/database/database.module';
import { TenantModule } from '#/scheduler-database/tenant/tenant.module';

@Module({
    imports: [
        DatabaseModule,
        SecretModule,
        ProcessContextModule,
        ProcessContextSecretModule,
        TenantModule
    ],
    exports: [],
})
export class SchedulerDatabaseModule { }
