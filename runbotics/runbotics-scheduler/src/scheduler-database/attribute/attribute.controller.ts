import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto, createAttributeSchema } from './dto/create-attribute.dto';
import { UpdateAttributeDto, updateAttributeSchema } from './dto/update-attribute.dto';
import { AuthRequest } from '#/types';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { Tenant } from 'runbotics-common';

@Controller('api/scheduler/tenants/:tenantId/credential-attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createAttributeSchema)) attributeDto: CreateAttributeDto,
    @Req() request: AuthRequest
  ) {
    return this.attributeService.create(attributeDto, request);
  }

  @Get()
  findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    const { user: { tenantId } } = request;
    return this.attributeService.findByIdAndTenantId(id, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateAttributeSchema)) attributeDto: UpdateAttributeDto, @Req() request: AuthRequest) {
    return this.attributeService.update(id, attributeDto, request);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.attributeService.delete(id, request);
  }
}