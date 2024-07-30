import { Module } from '@nestjs/common';

import { SecretModule } from '#/scheduler-database/secret/secret.module';
import { ProcessContextModule } from '#/scheduler-database/process-context/process-context.module';
import { ProcessContextSecretModule } from '#/scheduler-database/process-context-secret/process-context-secret.module';
import { DatabaseModule } from '#/database/database.module';
import { CredentialAttributeModule } from './credential-attribute/credential-attribute.module';
import { CredentialTemplateModule } from './credential-template/credential-template.module';
import { CredentialTemplateAttributeModule } from './credential-template-attribute/credential-template-attribute.module';
import { CredentialModule } from './credential/credential.module';
import { CredentialCollectionModule } from '#/scheduler-database/credential-collection/credential-collection.module';

@Module({
    imports: [
        SecretModule,
        ProcessContextModule,
        ProcessContextSecretModule,
        CredentialCollectionModule,
        CredentialAttributeModule,
        DatabaseModule,
        CredentialTemplateModule,
        CredentialTemplateAttributeModule,
        CredentialModule,
    ],
    exports: [],
})
export class SchedulerDatabaseModule { }
