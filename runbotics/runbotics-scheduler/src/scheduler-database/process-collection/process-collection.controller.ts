import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { Logger } from '#/utils/logger';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { FeatureKey } from 'runbotics-common';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollectionService } from './process-collection.service';
import { CreateProcessCollectionDto, createProcessCollectionSchema } from './dto/create-process-collection.dto';
import { UpdateProcessCollectionDto, updateProcessCollectionSchema } from './dto/update-process-collection.dto';
import { UUID } from 'crypto';

@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/process-collection')
export class ProcessCollectionController {
    constructor(
        private readonly processCollectionService: ProcessCollectionService,
    ) {}

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get('/access')
    async checkAccessToParent(
        @UserDecorator() user: User,
        @Query('parentId', new ParseUUIDPipe()) parentId: UUID,
    ) {
        if (parentId) {
            await this.processCollectionService.checkCollectionAvailability(parentId, user);
        } else {
            throw new BadRequestException('ParentId is required');
        }
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get('/user-accessible')
    async getAllUserAccessibleHierarchy(
        @UserDecorator() user: User,
    ) {
        return this.processCollectionService.getUserAccessible(user);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get('/:id')
    async getProcessCollectionById(
        @Param('id', new ParseUUIDPipe()) id: string,
        @UserDecorator() user: User,
    ) {
        return this.processCollectionService.getProcessCollectionById(id, user);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get()
    async getAll(
        @UserDecorator() user: User,
        @Query('parentId.equals') parentId?: string,
    ) {
        if (parentId) {
            this.processCollectionService.checkCollectionAvailability(parentId, user);

            const breadcrumbs = await this.processCollectionService.getCollectionAllAncestors(parentId, user);
            const children = await this.processCollectionService.getChildrenCollectionsByParent(parentId, user);

            return { breadcrumbs, childrenCollections: children };
        }
        const children = await this.processCollectionService.getChildrenCollectionsByRoot(user);

        return { childrenCollections: children, breadcrumbs: [] };
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_ADD)
    @Post()
    async create(
        @UserDecorator() user: User,
        @Body(new ZodValidationPipe(createProcessCollectionSchema)) createDto: CreateProcessCollectionDto,
    ) {
        return this.processCollectionService.create(user, createDto);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_EDIT)
    @Put('/:id')
    async update(
        @UserDecorator() user: User,
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateProcessCollectionSchema)) updateDto: UpdateProcessCollectionDto,
    ) {
        return this.processCollectionService.update(user, updateDto, id);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_DELETE)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    async delete(
        @UserDecorator() user: User,
        @Param('id') id: string,
    ) {
        await this.processCollectionService.delete(id, user);
    }
}
