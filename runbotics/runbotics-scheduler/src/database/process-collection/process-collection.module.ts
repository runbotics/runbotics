import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionEntity } from './process-collection.entity';
import { ProcessService } from './process.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionEntity])],
    exports: [ProcessService],
    providers: [ProcessService],
})
export class ProcessCollectionModule {}
