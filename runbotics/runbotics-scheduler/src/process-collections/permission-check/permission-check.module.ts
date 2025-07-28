import { Module } from '@nestjs/common';
import { PermissionCheckService } from './permission-check.service';
import { TenantAdminHandler } from './chain/tenant-admin.handler';
import { OwnerHandler } from './chain/owner.handler';
import { PublicCollectionHandler } from './chain/public-collection.handler';
import { SharedLinkHandler } from './chain/shared-link.handler';
import { PermissionTableHandler } from './chain/permission-table.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import {
    ProcessCollectionAuthorizationGuard
} from '#/process-collections/permission-check/process-collection-authorization.guard';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCollectionUser, ProcessCollection])],
    providers: [
        PermissionCheckService,
        TenantAdminHandler,
        OwnerHandler,
        PublicCollectionHandler,
        SharedLinkHandler,
        PermissionTableHandler,
        ProcessCollectionAuthorizationGuard,
    ],
    exports: [PermissionCheckService, ProcessCollectionAuthorizationGuard],
})
export class PermissionCheckModule {
}
