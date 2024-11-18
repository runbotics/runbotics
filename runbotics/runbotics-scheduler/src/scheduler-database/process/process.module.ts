import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessEntity } from './process.entity';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { ProcessCrudService } from '#/scheduler-database/process/process-crud.service';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';
import { ProcessCollectionModule } from '#/database/process-collection/process-collection.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProcessEntity, ProcessCollectionEntity, GlobalVariable, BotCollection]),
        ProcessCollectionModule,
        UserModule,
    ],
    exports: [ProcessService],
    providers: [ProcessService, ProcessCrudService],
    controllers: [ProcessController],
})
export class ProcessModule {
}
