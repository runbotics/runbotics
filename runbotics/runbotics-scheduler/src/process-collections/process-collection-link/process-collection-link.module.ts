import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import {
    ProcessCollectionLinkService,
} from '#/process-collections/process-collection-link/process-collection-link.service';
import {
    ProcessCollectionLinkController,
} from '#/process-collections/process-collection-link/process-collection-link.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionLink])],
    providers: [ProcessCollectionLinkService],
    controllers: [ProcessCollectionLinkController],
    exports: [ProcessCollectionLinkService],
})
export class ProcessCollectionLinkModule {
}
