import { Injectable } from '@nestjs/common';
import { TenantAdminHandler } from './chain/tenant-admin.handler';
import { OwnerHandler } from './chain/owner.handler';
import { PublicCollectionHandler } from './chain/public-collection.handler';
import { SharedLinkHandler } from './chain/shared-link.handler';
import { PermissionTableHandler } from './chain/permission-table.handler';
import { AuthRequest } from '#/types';

@Injectable()
export class PermissionCheckService {
    constructor(
        private readonly tenantAdminHandler: TenantAdminHandler,
        private readonly ownerHandler: OwnerHandler,
        private readonly publicCollectionHandler: PublicCollectionHandler,
        private readonly sharedLinkHandler: SharedLinkHandler,
        private readonly permissionTableHandler: PermissionTableHandler,
    ) {
        this.tenantAdminHandler
            .setNext(this.ownerHandler)
            .setNext(this.publicCollectionHandler)
            .setNext(this.sharedLinkHandler)
            .setNext(this.permissionTableHandler);
    }

    async authorize(request: AuthRequest, collectionId: number): Promise<boolean> {
        return this.tenantAdminHandler.handle(request, collectionId);
    }
}
