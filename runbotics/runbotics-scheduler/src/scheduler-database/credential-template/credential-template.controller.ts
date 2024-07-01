import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CredentialTemplateService } from './credential-template.service';
import { CreateCredentialTemplateDto, createCredentialTemplateSchema } from './dto/create-credential-template.dto';
import { UpdateCredentialTemplateDto, updateCredentialTemplateSchema } from './dto/update-credential-template.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { AuthRequest } from '#/types';

@Controller('api/scheduler/tenants/:tenantId/credential-templates')
export class CredentialTemplateController {
  constructor(private readonly credentialTemplateService: CredentialTemplateService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createCredentialTemplateSchema)) templateDto: CreateCredentialTemplateDto, @Req() request: AuthRequest) {
    return this.credentialTemplateService.create(templateDto, request);
  }

  @Get()
  findAll() {
    return this.credentialTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialTemplateService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialTemplateSchema)) templateDto: UpdateCredentialTemplateDto, @Req() request: AuthRequest) {
    return this.credentialTemplateService.updateById(id, templateDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialTemplateService.removeById(id);
  }
}
