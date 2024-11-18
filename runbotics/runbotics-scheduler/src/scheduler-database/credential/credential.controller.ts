import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UseInterceptors, Query } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CreateCredentialDto, createCredentialSchema } from './dto/create-credential.dto';
import { UpdateCredentialDto, updateCredentialSchema } from './dto/update-credential.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { UpdateAttributeDto } from '../credential-attribute/dto/update-attribute.dto';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { CredentialCriteria } from './criteria/credential.criteria';
import { User } from '../user/user.entity';

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
    @UserDecorator() user: User
  ) {
    this.logger.log('REST request to create new credential');
    return this.credentialService.create(credentialDto, collectionId, user);
  }

  @Get(COLLECTION_URL_PARTIAL)
  findAllAccessibleInCollection(@UserDecorator() user: User, @Param('collectionId') collectionId: string) {
    this.logger.log('REST request to get all credentials from collection ' + collectionId);
    return this.credentialService.findAllAccessibleByCollectionId(user, collectionId);
  }

  @Get('credentials/GetPage')
  getPages(
    @Specifiable(CredentialCriteria) specs: Specs<Credential>,
    @Pageable() paging: Paging,
    @UserDecorator() user: User
  ) {
    this.logger.log('REST request to get credentials by page');
    return this.credentialService.getAllAccessiblePages(user, paging, specs);
  }

  @Get('credentials/:id')
  findOneUserAccessible(@Param('id') id: string, @UserDecorator() user: User) {
    this.logger.log('REST request to get credential by id ' + id);
    return this.credentialService.findOneAccessibleById(id, user.tenantId, user);
  }

  @Patch(COLLECTION_URL_PARTIAL + ':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(updateCredentialSchema)) credentialDto: UpdateCredentialDto, @UserDecorator() user: User) {
    this.logger.log('REST request to update credential by id ' + id);
    return this.credentialService.updateById(id, credentialDto, user);
  }

  @Patch('credentials/:id/UpdateAttribute/:attributeName')
  updateAttribute(@Param('id') id: string, @Param('attributeName') attributeName: string, @Body() attributeDto: UpdateAttributeDto, @UserDecorator() user: User) {
    this.logger.log('REST request to update credential attribute by id ' + id);
    return this.credentialService.updateAttribute(id, attributeName, attributeDto, user);
  }

  @Delete(COLLECTION_URL_PARTIAL + ':id')
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    this.logger.log('REST request to delete credential by id ' + id);
    return this.credentialService.removeById(id, user);
  }


  @Get('credentials')
  findAllAccessible(
    @UserDecorator() user: User
  ) {
    this.logger.log('REST request to get all accessible credentials');

    return this.credentialService.findAllAccessible(user);
  }


  @Get('credentialsByTemplateAndProcess')
  findAllAccessibleByTemplateAndProcess(
    @Query() query,
    @UserDecorator() user: User
  ) {
    this.logger.log('REST request to get all accessible credentials by template and process');

    return this.credentialService.findAllAccessibleByTemplateAndProcess(
        query.templateName,
        query.processId,
        user
      );
  }
}
