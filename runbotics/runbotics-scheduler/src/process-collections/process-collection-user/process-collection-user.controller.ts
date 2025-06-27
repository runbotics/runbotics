import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AddProcessCollectionUserDto } from './dto/add-process-collection-user.dto';
import { ProcessCollectionUserService } from './process-collection-user.service';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollectionUser } from './process-collection-user.entity';
import { DeleteResult } from 'typeorm';

@Controller('api/process-collection-user')
export class ProcessCollectionUserController {

    constructor(private readonly processCollectionUserService: ProcessCollectionUserService) {
    }

    @Post()
    async addNewProcessCollectionUser(
        @Body() data: AddProcessCollectionUserDto,
        @UserDecorator() { id }: User,
    ): Promise<ProcessCollectionUser> {
        return this.processCollectionUserService.addNewProcessCollectionUser(id, data);
    }

    @Get(':id/:collectionId')
    async getProcessCollectionUser(
        @Param('id') id: number,
        @Param('collectionId') collectionId: number,
    ): Promise<ProcessCollectionUser> {
        return this.processCollectionUserService.getProcessCollectionUser(id, collectionId);
    }

    @Delete(':id/:collectionId')
    async deleteProcessCollectionUser(
        @Param('id') id: number,
        @Param('collectionId') collectionId: number,
    ): Promise<DeleteResult> {
        return this.processCollectionUserService.deleteProcessCollectionUser(id, collectionId);
    }
}
