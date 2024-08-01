import { Module } from '@nestjs/common';
import { CredentialTemplateService } from './credential-template.service';
import { CredentialTemplateController } from './credential-template.controller';
import { CredentialTemplate } from './credential-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialTemplateAttributeModule } from '../credential-template-attribute/credential-template-attribute.module';
import { CredentialModule } from '../credential/credential.module';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialTemplate]), CredentialTemplateAttributeModule, CredentialModule],
  controllers: [CredentialTemplateController],
  providers: [CredentialTemplateService],
  exports: [CredentialTemplateService],
})
export class CredentialTemplateModule {}