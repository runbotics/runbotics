import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Logger } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto, createCredentialSchema } from './dto/create-credential.dto';
import { UpdateCredentialDto, updateCredentialSchema } from './dto/update-credential.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { IUser } from 'runbotics-common';
import { User } from '#/utils/decorators/user.decorator';
import { UpdateAttributeDto } from '../credential-attribute/dto/update-attribute.dto';

const COLLECTION_URL_PARTIAL = 'credential-collections/:collectionId/credentials/';

@Controller('api/scheduler/tenants/:tenantId')
export class CredentialController {
  private readonly logger = new Logger(CredentialController.name);
  constructor(private readonly credentialService: CredentialService) {}

  @Post('credential-collections/:collectionId/credentials')
  create(
    @Body(new ZodValidationPipe(createCredentialSchema)) credentialDto: CreateCredentialDto,
    @Param('collectionId') collectionId,
    @User() user: IUser
  ) {
    return this.credentialService.create(credentialDto, collectionId, user);
  }

  @Get('credential-collections/:collectionId/credentials')
  findAllUserAccessible(@User() user: IUser, @Param('collectionId') collectionId: string) {
    return this.credentialService.findAllAccessibleByCollectionId(user, collectionId);
  }

  @Get('credential-collections/:collectionId/credentials/:id')
  findOneUserAccessible(@Param('id') id: string) {
    return this.credentialService.findOneAccessibleById(id);
  }

  @Patch('credential-collections/:collectionId/credentials/:id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialSchema)) credentialDto: UpdateCredentialDto, @User() user: IUser) {
    return this.credentialService.updateById(id, credentialDto, user);
  }

  @Patch('credential-collections/:collectionId/credentials:id/UpdateAttribute/:attributeName')
  updateAttribute(@Param('id') id: string, @Param('attributeName') attributeName: string, @Body() attributeDto: UpdateAttributeDto, @User() user: IUser) {
    return this.credentialService.updateAttribute(id, attributeName, attributeDto, user);
  }

  @Delete('credential-collections/:collectionId/credentials/:id')
  remove(@Param('id') id: string) {
    return this.credentialService.removeById(id);
  }

  @Get('credentials')
  findAllAccessible(@Param('tenantId') tenantId: string, @User() user: IUser) {
    return this.credentialService.findAllAccessible(tenantId, user);
  }
}
