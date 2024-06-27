import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { AuthRequest } from '#/types';

@Controller('credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post()
  create(@Body() credentialDto: CreateCredentialDto, @Req() request: AuthRequest) {
    return this.credentialService.create(credentialDto, request);
  }

  @Get()
  findAllByCollectionId(@Param('collectionId') collectionId: string) {
    return this.credentialService.findAllByCollectionId(collectionId);
  }

  @Get()
  findAllUserAccessible(@Req() request: AuthRequest) {
    return this.credentialService.findAllUserAccessible(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() credentialDto: UpdateCredentialDto) {
    return this.credentialService.updateById(id, credentialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialService.removeById(id);
  }
}
