import { Module } from '@nestjs/common';
import { PermissionCheckService } from './permission-check.service';
import { TenantAdminHandler } from './chain/tenant-admin.handler';
import { OwnerHandler } from './chain/owner.handler';
import { PublicCollectionHandler } from './chain/public-collection.handler';
import { SharedLinkHandler } from './chain/shared-link.handler';
import { PermissionTableHandler } from './chain/permission-table.handler';

@Module({
    providers: [
        PermissionCheckService,
        TenantAdminHandler,
        OwnerHandler,
        PublicCollectionHandler,
        SharedLinkHandler,
        PermissionTableHandler,
    ],
    exports: [PermissionCheckService],
})
export class PermissionCheckModule {}
