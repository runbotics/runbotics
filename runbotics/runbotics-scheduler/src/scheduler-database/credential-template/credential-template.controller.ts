import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CredentialTemplateService } from './credential-template.service';

@Controller('api/scheduler/tenants/:tenantId/credential-templates')
export class CredentialTemplateController {
  constructor(private readonly credentialTemplateService: CredentialTemplateService) {}

  @Get()
  findAll() {
    return this.credentialTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialTemplateService.findOneById(id);
  }
}
