// import { describe, expect, it, vi } from 'vitest';
// import { GrantPermissionStrategy } from '../grant-permission.strategy';
// import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
// import { PrivilegeType } from 'runbotics-common';
//
// describe('GrantAccessStrategy', () => {
//     it('should call grantAccess with correct arguments', async () => {
//         const accessRepo: Partial<PermissionRepository> = {
//             grantAccess: vi.fn().mockResolvedValue(undefined),
//         };
//
//         const strategy = new GrantPermissionStrategy(1, 1, PrivilegeType.WRITE, accessRepo as PermissionRepository);
//
//         await strategy.execute();
//
//         expect(accessRepo.grantAccess).toHaveBeenCalledWith(1, 1, PrivilegeType.WRITE);
//     });
// });
