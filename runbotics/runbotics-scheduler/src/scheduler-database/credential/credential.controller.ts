import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Logger } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto, createCredentialSchema } from './dto/create-credential.dto';
import { UpdateCredentialDto, updateCredentialSchema } from './dto/update-credential.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { IUser } from 'runbotics-common';
import { User } from '#/utils/decorators/user.decorator';
import { UpdateAttributeDto } from '../credential-attribute/dto/update-attribute.dto';

@Controller('api/scheduler/tenants/:tenantId/credential-collections/:collectionId/credentials')
export class CredentialController {
  private readonly logger = new Logger(CredentialController.name);
  constructor(private readonly credentialService: CredentialService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCredentialSchema)) credentialDto: CreateCredentialDto,
    @Param('collectionId') collectionId,
    @User() user: IUser
  ) {
    return this.credentialService.create(credentialDto, collectionId, user);
  }

  @Get()
  findAllUserAccessible(@Param('tenantId') tenantId: string) {
    return this.credentialService.findAllAccessibleByCollectionId(tenantId);
  }

  @Get(':id')
  findOneUserAccessible(@Param('id') id: string) {
    return this.credentialService.findOneAccessibleById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialSchema)) credentialDto: UpdateCredentialDto, @User() user: IUser) {
    return this.credentialService.updateById(id, credentialDto, user);
  }

  @Patch(':id/UpdateAttribute/:attributeName')
  updateAttribute(@Param('id') id: string, @Param('attributeName') attributeName: string, @Body() attributeDto: UpdateAttributeDto, @User() user: IUser) {
    return this.credentialService.updateAttribute(id, attributeName, attributeDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.credentialService.removeById(id);
  }
}
