import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from './process.entity';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessCrudService } from '#/database/process/process-crud.service';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessEntity, ProcessCollectionEntity, GlobalVariable]),
    ],
    exports: [ProcessService],
    providers: [ProcessService, ProcessCrudService],
    controllers: [ProcessController],
})
export class ProcessModule {
}
