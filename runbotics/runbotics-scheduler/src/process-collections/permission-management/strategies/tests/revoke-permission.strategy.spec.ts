// import { describe, expect, it, vi } from 'vitest';
// import { RevokePermissionStrategy } from '../revoke-permission.strategy';
// import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
//
// describe('RevokeAccessStrategy', () => {
//     it('should call revokeAccess with correct arguments', async () => {
//         const accessRepo: Partial<PermissionRepository> = {
//             revokeAccess: vi.fn().mockResolvedValue(undefined),
//         };
//
//         const strategy = new RevokePermissionStrategy(1, 1, accessRepo as PermissionRepository);
//
//         await strategy.execute();
//
//         expect(accessRepo.revokeAccess).toHaveBeenCalledWith(1, 1);
//     });
// });
