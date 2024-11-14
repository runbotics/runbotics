import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, Logger } from '@nestjs/common';
import { CredentialTemplateService } from './credential-template.service';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';

@UseInterceptors(TenantInterceptor)
@FeatureKeys(FeatureKey.CREDENTIALS_PAGE_READ)
@Controller('api/scheduler/tenants/:tenantId/credential-templates')
export class CredentialTemplateController {
  private readonly logger = new Logger(CredentialTemplateController.name);

  constructor(private readonly credentialTemplateService: CredentialTemplateService) {}

  @Get()
  findAll() {
    this.logger.log('Getting all credential templates');
    return this.credentialTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Getting credential template by id ' + id);
    return this.credentialTemplateService.findOneById(id);
  }
}
