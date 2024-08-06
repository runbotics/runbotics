import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { UserModule } from '#/database/user/user.module';
import { CredentialTemplateModule } from '../credential-template/credential-template.module';
import { CredentialAttributeModule } from '../credential-attribute/credential-attribute.module';
import { SecretService } from '../secret/secret.service';
import { SecretModule } from '../secret/secret.module';

@Module({
  imports: [TypeOrmModule.forFeature([Credential]), UserModule, CredentialAttributeModule, CredentialTemplateModule, SecretModule],
  controllers: [CredentialController],
  providers: [CredentialService],
  exports: [CredentialService]
})
export class CredentialModule {}
