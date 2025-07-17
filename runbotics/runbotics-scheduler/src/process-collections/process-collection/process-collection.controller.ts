import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProcessCollectionService } from './process-collection.service';
import { CreateProcessCollectionDto, createProcessCollectionSchema } from './dto/create-process-collection.dto';
import { ProcessCollection } from './process-collection.entity';
import { FeatureKey, User } from 'runbotics-common';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import {
    UpdateProcessCollectionDto,
    updateProcessCollectionSchema,
} from '#/process-collections/process-collection/dto/update-process-collection.dto';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';

@Controller('/api/v2/scheduler/tenants/:tenantId/process-collection')
export class ProcessCollectionController {

    constructor(private readonly processCollectionService: ProcessCollectionService) {
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get()
    async getAllByCollectionId(
        @UserDecorator() user: User,
        @Query('parentId') parentId?: string,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.getAllProcessCollections(user.id, parentId);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_ADD)
    @Post()
    async createProcessCollection(
        @Body(new ZodValidationPipe(createProcessCollectionSchema)) processCollection: CreateProcessCollectionDto,
        @Param('tenantId') tenantId: string,
        @UserDecorator() user: User,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.createProcessCollection({ tenantId, ...processCollection }, user.id);
    }
    
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_EDIT)
    @Post(':id/set-public')
    async setCollectionPublic(@Param('id') id: string): Promise<ProcessCollection> {
        return this.processCollectionService.setProcessCollectionPublic(id);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_DELETE)
    @Delete(':id')
    async deleteProcessCollection(@Param('id') id: string): Promise<ProcessCollection> {
        return this.processCollectionService.deleteProcessCollection(id);
    }

    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_READ)
    @Get(':id')
    async getProcessCollectionTree(@Param('id') id: string): Promise<ProcessCollection | ProcessCollection[]> {
        return this.processCollectionService.getProcessCollectionTree(id);
    }
    
    @FeatureKeys(FeatureKey.PROCESS_COLLECTION_EDIT)
    @Put(':id')
    async updateProcessCollection(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(updateProcessCollectionSchema)) processCollection: Omit<UpdateProcessCollectionDto, 'id'>,
        @UserDecorator() user: User,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.updateProcessCollection(id, processCollection);
    }
}
