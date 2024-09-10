import { Module } from '@nestjs/common';
import { CredentialTemplateService } from './credential-template.service';
import { CredentialTemplateController } from './credential-template.controller';
import { CredentialTemplate } from './credential-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialTemplate])],
  controllers: [CredentialTemplateController],
  providers: [CredentialTemplateService],
  exports: [CredentialTemplateService],
})
export class CredentialTemplateModule {}