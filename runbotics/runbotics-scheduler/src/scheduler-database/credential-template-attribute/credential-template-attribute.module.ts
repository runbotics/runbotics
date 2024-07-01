import { Module } from '@nestjs/common';
import { CredentialTemplateAttributeService } from './credential-template-attribute.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialTemplateAttribute } from './credential-template-attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialTemplateAttribute])],
  providers: [CredentialTemplateAttributeService],
  exports: [CredentialTemplateAttributeService],
})
export class CredentialTemplateAttributeModule {}

