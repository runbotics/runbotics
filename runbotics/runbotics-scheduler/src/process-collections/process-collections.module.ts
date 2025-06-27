import { Module } from '@nestjs/common';
import { ProcessCollectionModule } from './process-collection/process-collection.module';
import { ProcessCollectionUserModule } from './process-collection-user/process-collection-user.module';
import {
    ProcessCollectionLinkModule,
} from '#/process-collections/process-collection-link/process-collection-link.module';
import { PermissionManagementModule } from '#/process-collections/permission-management/permission-management.module';
import { ProcessCollectionsController } from '#/process-collections/process-collections.controller';
import { ProcessCollectionsService } from '#/process-collections/process-collections.service';
import { PermissionCheckModule } from '#/process-collections/permission-check/permission-check.module';

@Module({
    imports: [
        ProcessCollectionLinkModule,
        ProcessCollectionModule,
        ProcessCollectionUserModule,
        PermissionManagementModule,
        PermissionCheckModule,
    ],
    controllers: [ProcessCollectionsController],
    providers: [ProcessCollectionsService],
})
export class ProcessCollectionsModule {
}
