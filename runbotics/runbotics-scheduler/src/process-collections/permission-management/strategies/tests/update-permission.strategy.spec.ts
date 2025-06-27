import { describe, expect, it, vi } from 'vitest';
import { UpdatePermissionStrategy } from '../update-permission.strategy';
import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
import { PrivilegeType } from 'runbotics-common';

describe('UpdateUserAccessStrategy', () => {
    it('should update user access in the correct order', async () => {
        const accessRepo: Partial<PermissionRepository> = {
            getUserAccess: vi.fn().mockResolvedValue({ accessLevel: 'READ' }),
            revokeAccess: vi.fn().mockResolvedValue(undefined),
            grantAccess: vi.fn().mockResolvedValue(undefined),
        };

        const strategy = new UpdatePermissionStrategy(1, 1,PrivilegeType.WRITE, accessRepo as PermissionRepository);

        await strategy.execute();

        expect(accessRepo.getUserAccess).toHaveBeenCalledWith(1, 1);
        expect(accessRepo.revokeAccess).toHaveBeenCalledWith(1, 1);
        expect(accessRepo.grantAccess).toHaveBeenCalledWith(1, 1, PrivilegeType.WRITE);
    });

    it('should work even if previous access does not exist', async () => {
        const accessRepo: Partial<PermissionRepository> = {
            getUserAccess: vi.fn().mockResolvedValue(null),
            revokeAccess: vi.fn().mockResolvedValue(undefined),
            grantAccess: vi.fn().mockResolvedValue(undefined),
        };

        const strategy = new UpdatePermissionStrategy(2, 2, PrivilegeType.READ, accessRepo as PermissionRepository);

        await strategy.execute();

        expect(accessRepo.getUserAccess).toHaveBeenCalled();
        expect(accessRepo.revokeAccess).toHaveBeenCalled();
        expect(accessRepo.grantAccess).toHaveBeenCalled();
    });
});
