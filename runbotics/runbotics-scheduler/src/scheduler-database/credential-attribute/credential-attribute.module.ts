import { Module } from '@nestjs/common';
import { CredentialAttributeService } from './credential-attribute.service';
import { AttributeController } from './credential-attribute.controller';
import { CredentialAttribute } from './credential-attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '../secret/secret.entity';
import { SecretService } from '../secret/secret.service';
import { SecretModule } from '../secret/secret.module';
import { CredentialService } from '../credential/credential.service';
import { Credential } from '../credential/credential.entity';
import { CredentialTemplateModule } from '../credential-template/credential-template.module';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialAttribute, Secret, Credential]), SecretModule, CredentialTemplateModule],
  controllers: [AttributeController],
  providers: [CredentialAttributeService, SecretService, CredentialService],
  exports: [CredentialAttributeService],
})
export class CredentialAttributeModule {}