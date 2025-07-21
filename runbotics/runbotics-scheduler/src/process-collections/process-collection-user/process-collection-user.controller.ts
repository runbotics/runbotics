import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddProcessCollectionUserDto, AddProcessCollectionUserZodDto } from './dto/add-process-collection-user.dto';
import { ProcessCollectionUserService } from './process-collection-user.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollectionUser } from './process-collection-user.entity';
import { DeleteResult } from 'typeorm';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('/api/v2/scheduler/tenants/:tenantId/process-collection-user')
export class ProcessCollectionUserController {

    constructor(private readonly processCollectionUserService: ProcessCollectionUserService) {
    }

    @ApiOperation({ summary: 'Save new process collection privilege to user' })
    @ApiResponse({ status: 200, description: 'Process collection user privilege', type: ProcessCollectionUser })
    @ApiBody({ type: AddProcessCollectionUserZodDto })
    @Post()
    async addNewProcessCollectionUser(
        @Body() data: AddProcessCollectionUserDto,
        @UserDecorator() { id }: User,
    ): Promise<ProcessCollectionUser> {
        return this.processCollectionUserService.addNewProcessCollectionUser(id, data);
    }

    @ApiOperation({ summary: 'Get privileges for process collection by user' })
    @ApiParam({ name: 'collectionId', required: true, description: 'ID of the collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
    @ApiResponse({ status: 200, description: 'Process collection user', type: ProcessCollectionUser })
    @Get(':id/process-collection/:collectionId')
    async getProcessCollectionUser(
        @Param('id') id: number,
        @Param('collectionId') collectionId: string,
    ): Promise<ProcessCollectionUser> {
        return this.processCollectionUserService.getProcessCollectionUser(id, collectionId);
    }

    @ApiOperation({ summary: 'Delete privilege for process collection by user' })
    @ApiParam({ name: 'collectionId', required: true, description: 'ID of the collection' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the user' })
    @ApiResponse({ status: 200, description: 'delete result of process collection user', type: DeleteResult })
    @Delete(':id/process-collection/:collectionId')
    async deleteProcessCollectionUser(
        @Param('id') id: number,
        @Param('collectionId') collectionId: string,
    ): Promise<DeleteResult> {
        return this.processCollectionUserService.deleteProcessCollectionUser(id, collectionId);
    }
}
