import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProcessCollectionService } from './process-collection.service';
import { InsertProcessCollectionDTO } from './dto/insert-process-collection.dto';
import { ProcessCollection } from './process-collection.entity';
import { User } from 'runbotics-common';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';

@Controller('api/process-collection')
export class ProcessCollectionController {

    constructor(private readonly processCollectionService: ProcessCollectionService) {
    }

    @Post()
    async createProcessCollection(
        @Body() processCollection: InsertProcessCollectionDTO,
        @UserDecorator() user: User,
    ): Promise<ProcessCollection> {
        return this.processCollectionService.insertNewProcessCollection(processCollection, user.id);
    }

    @Delete(':id')
    async deleteProcessCollection(@Param('id') id: number): Promise<ProcessCollection> {
        return this.processCollectionService.deleteProcessCollection(id);
    }

    @Get(':id')
    async getProcessCollection(@Param('id') id: number): Promise<ProcessCollection | ProcessCollection[]> {
        return this.processCollectionService.getProcessCollectionTree(id);
    }
}
