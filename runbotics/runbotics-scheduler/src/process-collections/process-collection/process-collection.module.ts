import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionService } from './process-collection.service';
import { ProcessCollectionController } from './process-collection.controller';
import { ProcessCollection } from './process-collection.entity';
import {
    ProcessCollectionLinkModule,
} from '#/process-collections/process-collection-link/process-collection-link.module';
import {
    ProcessCollectionUserModule,
} from '#/process-collections/process-collection-user/process-collection-user.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollection]),
        forwardRef(() =>ProcessCollectionLinkModule),
        ProcessCollectionUserModule],
    providers: [ProcessCollectionService],
    controllers: [ProcessCollectionController],
    exports: [ProcessCollectionService],
})
export class ProcessCollectionModule {
}
