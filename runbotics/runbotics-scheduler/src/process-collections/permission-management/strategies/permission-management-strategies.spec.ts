import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GrantPermissionStrategy } from './grant-permission.strategy';
import { RevokePermissionStrategy } from './revoke-permission.strategy';
import { PrivilegeType } from 'runbotics-common';
import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
import { EntityManager } from 'typeorm';

describe('Permission Management Strategies', () => {
    let permissionRepo: PermissionRepository;
    let entityManager: EntityManager;

    const mockUserId = 1;
    const mockCollectionId = 'col-1';
    const mockPrivilege = PrivilegeType.WRITE;

    beforeEach(() => {
        // Mockowanie metod repozytorium
        permissionRepo = {
            grantAccess: vi.fn(),
            revokeAccess: vi.fn(),
        } as unknown as PermissionRepository;

        entityManager = {} as EntityManager;
    });

    describe('GrantPermissionStrategy', () => {
        it('should call grantAccess with correct parameters', async () => {
            const strategy = new GrantPermissionStrategy(
                mockUserId,
                mockCollectionId,
                mockPrivilege,
                permissionRepo
            );

            await strategy.execute(entityManager);

            expect(permissionRepo.grantAccess).toHaveBeenCalledOnce();
            expect(permissionRepo.grantAccess).toHaveBeenCalledWith(
                mockUserId,
                mockCollectionId,
                mockPrivilege,
                entityManager
            );
        });

        it('should call grantAccess even without entityManager', async () => {
            const strategy = new GrantPermissionStrategy(
                mockUserId,
                mockCollectionId,
                mockPrivilege,
                permissionRepo
            );

            await strategy.execute();

            expect(permissionRepo.grantAccess).toHaveBeenCalledOnce();
            expect(permissionRepo.grantAccess).toHaveBeenCalledWith(
                mockUserId,
                mockCollectionId,
                mockPrivilege,
                undefined
            );
        });
    });

    describe('RevokePermissionStrategy', () => {
        it('should call revokeAccess with correct parameters', async () => {
            const strategy = new RevokePermissionStrategy(
                mockUserId,
                mockCollectionId,
                permissionRepo
            );

            await strategy.execute(entityManager);

            expect(permissionRepo.revokeAccess).toHaveBeenCalledOnce();
            expect(permissionRepo.revokeAccess).toHaveBeenCalledWith(
                mockUserId,
                mockCollectionId,
                entityManager
            );
        });

        it('should call revokeAccess even without entityManager', async () => {
            const strategy = new RevokePermissionStrategy(
                mockUserId,
                mockCollectionId,
                permissionRepo
            );

            await strategy.execute();

            expect(permissionRepo.revokeAccess).toHaveBeenCalledOnce();
            expect(permissionRepo.revokeAccess).toHaveBeenCalledWith(
                mockUserId,
                mockCollectionId,
                undefined
            );
        });
    });
});
