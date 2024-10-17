import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionEntity } from './process-collection.entity';
import { ProcessCollectionService } from '#/database/process-collection/dto/process-collection.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionEntity])],
    providers: [ProcessCollectionService],
    exports: [ProcessCollectionService],
})
export class ProcessCollectionModule {
}
