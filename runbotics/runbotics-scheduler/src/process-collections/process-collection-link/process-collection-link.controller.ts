import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
    ProcessCollectionLinkService,
} from '#/process-collections/process-collection-link/process-collection-link.service';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { DeleteResult } from 'typeorm';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('/api/v2/scheduler/tenants/:tenantId/process-collection-link')
export class ProcessCollectionLinkController {

    constructor(private readonly processCollectionLinkService: ProcessCollectionLinkService) {
    }

    @ApiOperation({ summary: 'Save new sharable link for process collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the sharable link' })
    @ApiResponse({ status: 200, description: 'New Process Collection Link entry', type: ProcessCollectionLink })
    @Post(':id')
    async addNewProcessCollectionLink(
        @Param('id') collectionId: string,
        @UserDecorator() user: User,
    ): Promise<ProcessCollectionLink> {
        return this.processCollectionLinkService.addNewProcessCollectionLink({ collectionId, userId: user.id });
    }

    @ApiOperation({ summary: 'Get a sharable link for process collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the sharable link for collection' })
    @ApiResponse({ status: 200, description: 'Process collection link', type: ProcessCollectionLink })
    @Get(':id')
    async getProcessCollectionLink(@Param('id') id: string): Promise<ProcessCollectionLink> {
        return this.processCollectionLinkService.getProcessCollectionLink(id);
    }

    @ApiOperation({ summary: 'Delete a sharable link for process collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the sharable link' })
    @ApiResponse({ status: 200, description: 'Delete result', type: DeleteResult })
    @Delete(':id')
    async deleteProcessCollectionLink(@Param('id') id: string): Promise<DeleteResult> {
        return this.processCollectionLinkService.deleteProcessCollectionLink(id);
    }
}
