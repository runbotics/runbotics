import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PermissionCheckService } from './permission-check.service';
import { TenantAdminHandler } from './chain/tenant-admin.handler';
import { OwnerHandler } from './chain/owner.handler';
import { PublicCollectionHandler } from './chain/public-collection.handler';
import { SharedLinkHandler } from './chain/shared-link.handler';
import { PermissionTableHandler } from './chain/permission-table.handler';

describe('PermissionCheckService', () => {
    let service: PermissionCheckService;

    let tenantAdminHandler: TenantAdminHandler;
    let ownerHandler: OwnerHandler;
    let publicCollectionHandler: PublicCollectionHandler;
    let sharedLinkHandler: SharedLinkHandler;
    let permissionTableHandler: PermissionTableHandler;

    const mockRequest = {
        user: {
            id: 1,
            roles: [],
        },
        params: {
            tenantId: 'tenant-1',
        },
    };

    beforeEach(() => {
        // Mocks for handlers
        tenantAdminHandler = {
            setNext: vi.fn().mockReturnThis(),
            handle: vi.fn(),
        } as any;

        ownerHandler = {
            setNext: vi.fn().mockReturnThis(),
        } as any;

        publicCollectionHandler = {
            setNext: vi.fn().mockReturnThis(),
        } as any;

        sharedLinkHandler = {
            setNext: vi.fn().mockReturnThis(),
        } as any;

        permissionTableHandler = {
            setNext: vi.fn().mockReturnThis(),
        } as any;

        service = new PermissionCheckService(
            tenantAdminHandler,
            ownerHandler,
            publicCollectionHandler,
            sharedLinkHandler,
            permissionTableHandler
        );
    });

    it('should authorize using first handler that returns true', async () => {
        (tenantAdminHandler.handle as any).mockResolvedValue(true);

        const result = await service.authorize(mockRequest as any, 'col-123');

        expect(tenantAdminHandler.handle).toHaveBeenCalledWith(mockRequest, 'col-123');
        expect(result).toBe(true);
    });

    it('should return false if all handlers return false', async () => {
        (tenantAdminHandler.handle as any).mockResolvedValue(false);

        const result = await service.authorize(mockRequest as any, 'col-456');

        expect(result).toBe(false);
    });

});
