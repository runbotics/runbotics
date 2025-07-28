import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProcessCollectionService } from './process-collection.service';
import {
    CreateProcessCollectionDto,
    createProcessCollectionSchema,
    CreateProcessCollectionZodDto,
} from './dto/create-process-collection.dto';
import { ProcessCollection } from './process-collection.entity';
import { FeatureKey, User } from 'runbotics-common';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import {
    UpdateProcessCollectionDto,
    updateProcessCollectionSchema,
    UpdateProcessCollectionZodDto,
} from '#/process-collections/process-collection/dto/update-process-collection.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CollectionAuthorize } from '#/process-collections/permission-check/process-collection-authorize.decorator';

@ApiTags('Process Collections')
@Controller('/api/v2/scheduler/tenants/:tenantId/process-collection')
export class ProcessCollectionController {

    constructor(private readonly processCollectionService: ProcessCollectionService) {
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get()
    @ApiOperation({ summary: 'Get all process collections (optionally filtered by parentId)' })
    @ApiQuery({ name: 'parentId', required: false, description: 'Optional ID of parent collection to filter by' })
    @ApiResponse({ status: 200, description: 'List of process collections', type: ProcessCollection })
    async getAllByCollectionId(
        @UserDecorator() user: User,
        @Query('parentId') parentId?: string,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.getAllProcessCollections(user.id, parentId);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_ADD)
    @Post()
    @ApiOperation({ summary: 'Create a new process collection' })
    @ApiParam({ name: 'tenantId', required: true, description: 'Tenant identifier' })
    @ApiBody({ type: CreateProcessCollectionZodDto })
    @ApiResponse({ status: 201, description: 'Process collection created', type: ProcessCollection })
    async createProcessCollection(
        @Body(new ZodValidationPipe(createProcessCollectionSchema)) processCollection: CreateProcessCollectionDto,
        @Param('tenantId') tenantId: string,
        @UserDecorator() user: User,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.createProcessCollection({ tenantId, ...processCollection }, user.id);
    }

    @CollectionAuthorize('id')
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_EDIT)
    @Post(':id/set-public')
    @ApiOperation({ summary: 'Set a process collection as public' })
    @ApiParam({ name: 'id', required: true, description: 'Collection ID to set as public' })
    @ApiResponse({ status: 200, description: 'Collection visibility updated', type: ProcessCollection })
    async setCollectionPublic(
        @Param('id') id: string,
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        @Query('isPublic') isPublic: boolean = false,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.setProcessCollectionPublic(id, isPublic);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_DELETE)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a process collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the collection to delete' })
    @ApiResponse({ status: 200, description: 'Deleted process collection', type: ProcessCollection })
    async deleteProcessCollection(@Param('id') id: string): Promise<ProcessCollection> {
        return this.processCollectionService.deleteProcessCollection(id);
    }

    @CollectionAuthorize('id')
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get(':id')
    @ApiOperation({ summary: 'Get a process collection tree (with children)' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the collection' })
    @ApiResponse({ status: 200, description: 'Process collection tree', type: ProcessCollection, isArray: true })
    async getProcessCollectionTree(@Param('id') id: string): Promise<ProcessCollection | ProcessCollection[]> {
        return this.processCollectionService.getProcessCollectionTree(id);
    }

    @CollectionAuthorize('id')
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_EDIT)
    @Put(':id')
    @ApiOperation({ summary: 'Update a process collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the collection to update' })
    @ApiBody({ type: UpdateProcessCollectionZodDto })
    @ApiResponse({ status: 200, description: 'Updated process collection', type: ProcessCollection })
    async updateProcessCollection(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateProcessCollectionSchema)) processCollection: Omit<UpdateProcessCollectionDto, 'id'>,
        @UserDecorator() user: User,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.updateProcessCollection(id, processCollection);
    }
}
