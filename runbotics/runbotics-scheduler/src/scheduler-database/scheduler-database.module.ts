import { Module } from '@nestjs/common';

import { SecretModule } from '#/scheduler-database/secret/secret.module';
import { ProcessContextModule } from '#/scheduler-database/process-context/process-context.module';
import { ProcessContextSecretModule } from '#/scheduler-database/process-context-secret/process-context-secret.module';
import { DatabaseModule } from '#/database/database.module';
import { AttributeModule } from './attribute/attribute.module';

@Module({
    imports: [
        SecretModule,
        ProcessContextModule,
        ProcessContextSecretModule,
        AttributeModule,
        DatabaseModule,
    ],
    exports: [],
})
export class SchedulerDatabaseModule { }
