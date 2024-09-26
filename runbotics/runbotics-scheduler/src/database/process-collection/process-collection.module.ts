import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionEntity } from './process-collection.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionEntity])],
})
export class ProcessCollectionModule {}
