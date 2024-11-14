import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseInterceptors,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import {
    CreateCredentialCollectionDto,
    createCredentialCollectionSchema,
} from './dto/create-credential-collection.dto';
import {
    UpdateCredentialCollectionDto,
    updateCredentialCollectionSchema,
} from './dto/update-credential-collection.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { Logger } from '#/utils/logger';
import { AuthRequest } from '#/types';
import { User } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey, IUser } from 'runbotics-common';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { CredentialCollectionCriteria } from './criteria/credential-collection.criteria';

@UseInterceptors(TenantInterceptor)
@FeatureKeys(FeatureKey.CREDENTIALS_PAGE_READ)
@Controller('api/scheduler/tenants/:tenantId/credential-collections')
export class CredentialCollectionController {
    private readonly logger = new Logger(CredentialCollectionController.name);
    constructor(
        private readonly credentialCollectionService: CredentialCollectionService
    ) {}

    @Post()
    async create(
        @Body(new ZodValidationPipe(createCredentialCollectionSchema))
        createCredentialCollectionDto: CreateCredentialCollectionDto,
        @User() user: IUser,
    ) {
        this.logger.log('REST request to create credential collection');

        const collection = await this.credentialCollectionService.create(
            createCredentialCollectionDto,
            user,
        );

        return collection;
    }

    @Get('/GetPage')
    getPages(
        @Specifiable(CredentialCollectionCriteria) specs: Specs<Credential>,
        @Pageable() paging: Paging,
        @User() user: IUser
      ) {
        this.logger.log('REST request to get credential collections by page');
        return this.credentialCollectionService.getAllAccessiblePages(user, specs, paging);
      }

    @Get()
    findAll(@User() user: IUser) {
        this.logger.log('REST request to get credential collections');

        return this.credentialCollectionService.findAllAccessible(user);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @Request() request: AuthRequest
    ) {
        this.logger.log(`REST request to get collection with id (${id})`);

        return this.credentialCollectionService.findOneAccessibleById(id, request.user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateCredentialCollectionSchema))
        updateCredentialCollectionDto: UpdateCredentialCollectionDto,
        @User() user: IUser,
    ) {
        this.logger.log(`REST request to update credential collection with id (${id})`);

        return this.credentialCollectionService.update(
            id,
            updateCredentialCollectionDto,
            user,
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('id') id: string,
        @User() user: IUser,
    ) {
        this.logger.log(`REST request to delete credential collection with id (${id})`);
        await this.credentialCollectionService.delete(id, user);
    }
}
