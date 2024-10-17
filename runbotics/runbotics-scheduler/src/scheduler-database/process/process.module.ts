import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from './process.entity';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessCrudService } from '#/scheduler-database/process/process-crud.service';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { BotCollectionEntity } from '#/database/bot-collection/bot-collection.entity';
import { ProcessCollectionModule } from '#/database/process-collection/process-collection.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessEntity, ProcessCollectionEntity, GlobalVariable, BotCollectionEntity]),
        ProcessCollectionModule,
    ],
    exports: [ProcessService],
    providers: [ProcessService, ProcessCrudService],
    controllers: [ProcessController],
})
export class ProcessModule {
}
