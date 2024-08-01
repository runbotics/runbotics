import { Module } from '@nestjs/common';
import { CredentialAttributeService } from './credential-attribute.service';
import { AttributeController } from './credential-attribute.controller';
import { CredentialAttribute } from './credential-attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '../secret/secret.entity';
import { SecretService } from '../secret/secret.service';
import { SecretModule } from '../secret/secret.module';
import { CredentialTemplateService } from '../credential-template/credential-template.service';
import { CredentialService } from '../credential/credential.service';
import { CredentialTemplate } from '../credential-template/credential-template.entity';
import { Credential } from '../credential/credential.entity';
import { CredentialTemplateAttribute } from '../credential-template-attribute/credential-template-attribute.entity';
import { CredentialTemplateAttributeService } from '../credential-template-attribute/credential-template-attribute.service';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialAttribute, Secret, Credential, CredentialTemplate, CredentialTemplateAttribute]), SecretModule],
  controllers: [AttributeController],
  providers: [CredentialAttributeService, SecretService, CredentialTemplateService, CredentialService, CredentialTemplateAttributeService],
  exports: [CredentialAttributeService],
})
export class CredentialAttributeModule {}