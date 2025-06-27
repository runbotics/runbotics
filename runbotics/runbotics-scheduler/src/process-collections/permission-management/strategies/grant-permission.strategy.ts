import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
import { PrivilegeType } from 'runbotics-common';
import { PermissionStrategy } from './permission-strategy.interface';

export class GrantPermissionStrategy implements PermissionStrategy {
    constructor(
        private readonly userId: number,
        private readonly collectionId: number,
        private readonly level: PrivilegeType, // e.g. 'READ' | 'WRITE'
        private readonly accessRepo: PermissionRepository,
    ) {
    }

    async execute(): Promise<void> {
        await this.accessRepo.grantAccess(this.userId, this.collectionId, this.level);
    }
}
