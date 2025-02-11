import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionService } from '#/scheduler-database/process-collection/process-collection.service';
import { ProcessCollection } from './process-collection.entity';
import { ProcessCollectionController } from './process-collection.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollection])],
    providers: [ProcessCollectionService],
    exports: [ProcessCollectionService],
    controllers: [ProcessCollectionController],
})
export class ProcessCollectionModule {}
