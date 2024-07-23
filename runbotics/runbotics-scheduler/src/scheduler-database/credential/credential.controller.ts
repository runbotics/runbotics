import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto, createCredentialSchema } from './dto/create-credential.dto';
import { UpdateCredentialDto, updateCredentialSchema } from './dto/update-credential.dto';
import { AuthRequest } from '#/types';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';

@Controller('api/scheduler/tenants/:tenantId/credentials')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createCredentialSchema)) credentialDto: CreateCredentialDto, @Req() request: AuthRequest) {
    return this.credentialService.create(credentialDto, request);
  }

  // @Get()
  // findAllByCollectionId(@Param('collectionId') collectionId: string) {
  //   return this.credentialService.findAllByCollectionId(collectionId);
  // }

  @Get()
  findAllUserAccessible(@Req() request: AuthRequest) {
    return this.credentialService.findAllAccessibleByCollectionId(request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.credentialService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialSchema)) credentialDto: UpdateCredentialDto, @Req() request: AuthRequest) {
    return this.credentialService.updateById(id, credentialDto, request);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialService.removeById(id);
  }
}
