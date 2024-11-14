import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { UserModule } from '#/database/user/user.module';
import { CredentialTemplateModule } from '../credential-template/credential-template.module';
import { SecretModule } from '../secret/secret.module';
import { CredentialCollectionModule } from '../credential-collection/credential-collection.module';
import { CredentialCollectionService } from '../credential-collection/credential-collection.service';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';
import { CredentialCollectionUser } from '../credential-collection-user/credential-collection-user.entity';
import { MailModule } from '#/mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Credential,
            CredentialCollection,
            CredentialCollectionUser,
        ]),
        UserModule,
        CredentialTemplateModule,
        SecretModule,
        CredentialCollectionModule,
        MailModule,
    ],
    controllers: [CredentialController],
    providers: [CredentialService, CredentialCollectionService],
    exports: [CredentialService],
})
export class CredentialModule {}
