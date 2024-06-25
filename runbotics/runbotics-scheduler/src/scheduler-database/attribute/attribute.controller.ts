import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AttributeService } from './attribute.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AuthRequest } from '#/types';

@Controller('attribute')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto, @Req() request: AuthRequest) {
    return this.attributeService.create(createAttributeDto, request);
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
  update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto, @Req() request: AuthRequest) {
    return this.attributeService.update(id, updateAttributeDto, request);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() request: AuthRequest) {
    return this.attributeService.delete(id, request);
  }
}