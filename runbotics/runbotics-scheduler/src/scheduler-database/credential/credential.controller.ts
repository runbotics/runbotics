import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseInterceptors, Query } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto, createCredentialSchema } from './dto/create-credential.dto';
import { UpdateCredentialDto, updateCredentialSchema } from './dto/update-credential.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { IUser } from 'runbotics-common';
import { User } from '#/utils/decorators/user.decorator';
import { UpdateAttributeDto } from '../credential-attribute/dto/update-attribute.dto';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { isCredentialFilterQuery } from '#/utils/typeChecks';

const COLLECTION_URL_PARTIAL = 'credential-collections/:collectionId/credentials/';
@UseInterceptors(TenantInterceptor)
@Controller('api/scheduler/tenants/:tenantId')
export class CredentialController {
  private readonly logger = new Logger(CredentialController.name);
  constructor(private readonly credentialService: CredentialService) {}

  @Post(COLLECTION_URL_PARTIAL)
  create(
    @Body(new ZodValidationPipe(createCredentialSchema)) credentialDto: CreateCredentialDto,
    @Param('collectionId') collectionId,
    @User() user: IUser
  ) {
    this.logger.log('REST request to create new credential');
    return this.credentialService.create(credentialDto, collectionId, user);
  }

  @Get(COLLECTION_URL_PARTIAL)
  findAllAccessibleInCollection(@User() user: IUser, @Param('collectionId') collectionId: string) {
    this.logger.log('REST request to get all credentials from collection ' + collectionId);
    return this.credentialService.findAllAccessibleByCollectionId(user, collectionId);
  }

  @Get(COLLECTION_URL_PARTIAL + ':id')
  findOneUserAccessible(@Param('id') id: string, @User() user: IUser) {
    this.logger.log('REST request to get credential by id ' + id);
    return this.credentialService.findOneAccessibleById(id, user.tenantId);
  }

  @Patch(COLLECTION_URL_PARTIAL + ':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialSchema)) credentialDto: UpdateCredentialDto, @User() user: IUser) {
    this.logger.log('REST request to update credential by id ' + id);
    return this.credentialService.updateById(id, credentialDto, user);
  }

  @Patch(COLLECTION_URL_PARTIAL + ':id/UpdateAttribute/:attributeName')
  updateAttribute(@Param('id') id: string, @Param('attributeName') attributeName: string, @Body() attributeDto: UpdateAttributeDto, @User() user: IUser) {
    this.logger.log('REST request to update credential attribute by id ' + id);
    return this.credentialService.updateAttribute(id, attributeName, attributeDto, user);
  }

  @Delete(COLLECTION_URL_PARTIAL + ':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    this.logger.log('REST request to delete credential by id ' + id);
    return this.credentialService.removeById(id, user.tenantId);
  }

  @Get('credentials')
  findAllAccessible(
    @Query() query,
    @Param('tenantId') tenantId: string,
    @User() user: IUser
  ) {
    this.logger.log('REST request to get all accessible credentials');

    return isCredentialFilterQuery(query)
      ? this.credentialService.findAllAccessibleByTemplateAndProcess(
        query.templateName, query.processId, user
      )
      : this.credentialService.findAllAccessible(tenantId, user);
  }
}
