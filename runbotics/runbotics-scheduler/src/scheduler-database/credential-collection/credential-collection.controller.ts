import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
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
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { User } from '../user/user.entity';
import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Specifiable, Specs } from '#/utils/specification/specifiable.decorator';
import { Pageable, Paging } from '#/utils/page/pageable.decorator';
import { CredentialCollectionCriteria } from './criteria/credential-collection.criteria';
import { CredentialCollection } from './credential-collection.entity';

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
        @UserDecorator() user: User,
    ) {
        const collection = await this.credentialCollectionService.create(
            createCredentialCollectionDto,
            user,
        );

        return collection;
    }

    @Get('/GetPage')
    getPages(
        @Specifiable(CredentialCollectionCriteria) specs: Specs<CredentialCollection>,
        @Pageable() paging: Paging,
        @UserDecorator() user: User,
      ) {
        return this.credentialCollectionService.getAllAccessiblePages(user, specs, paging);
      }

    @Get()
    findAll(
        @UserDecorator() user: User,
    ) {
        return this.credentialCollectionService.findAllAccessible(user);
    }

    @Get(':id')
    findOne(
        @Param('id') id: string,
        @UserDecorator() user: User,
    ) {
        return this.credentialCollectionService.findOneAccessibleById(id, user);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateCredentialCollectionSchema))
            updateCredentialCollectionDto: UpdateCredentialCollectionDto,
        @UserDecorator() user: User,
    ) {

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
        @UserDecorator() user: User,
    ) {
        await this.credentialCollectionService.delete(id, user);
    }
}
