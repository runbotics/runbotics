import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CredentialTemplateService } from './credential-template.service';
import { CreateCredentialTemplateDto } from './dto/create-credential-template.dto';
import { UpdateCredentialTemplateDto } from './dto/update-credential-template.dto';

@Controller('credential-templates')
export class CredentialTemplateController {
  constructor(private readonly credentialTemplateService: CredentialTemplateService) {}

  @Post()
  create(@Body() templateDto: CreateCredentialTemplateDto) {
    return this.credentialTemplateService.create(templateDto);
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
  update(@Param('id') id: string, @Body() templateDto: UpdateCredentialTemplateDto) {
    return this.credentialTemplateService.updateById(id, templateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialTemplateService.removeById(id);
  }
}
