import { Controller, Delete, Get, Post, Param } from '@nestjs/common';
import {
    ProcessCollectionLinkService,
} from '#/process-collections/process-collection-link/process-collection-link.service';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { DeleteResult } from 'typeorm';

@Controller('/api/v2/scheduler/tenants/:tenantId/process-collection-link')
export class ProcessCollectionLinkController {

    constructor(private readonly processCollectionLinkService: ProcessCollectionLinkService) {
    }

    @Post(':id')
    async addNewProcessCollectionLink(@Param('id') collectionId: string, @UserDecorator() user: User): Promise<ProcessCollectionLink> {
        return this.processCollectionLinkService.addNewProcessCollectionLink({collectionId, userId: user.id});
    }
    
    @Get(':id')
    async getProcessCollectionLink(@Param('id') id: string): Promise<ProcessCollectionLink> {
        return this.processCollectionLinkService.getProcessCollectionLink(id);
    }
    
    @Delete(':id')
    async deleteProcessCollectionLink(@Param('id') id: string): Promise<DeleteResult> {
        return this.processCollectionLinkService.deleteProcessCollectionLink(id);
    }
}
