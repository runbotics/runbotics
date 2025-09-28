import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
import { PrivilegeType } from 'runbotics-common';
import { PermissionStrategy } from './permission-strategy.interface';
import { EntityManager } from 'typeorm';

export class GrantPermissionStrategy implements PermissionStrategy {
    constructor(
        private readonly userId: number,
        private readonly collectionId: string,
        private readonly level: PrivilegeType, // e.g. 'READ' | 'WRITE'
        private readonly accessRepo: PermissionRepository,
    ) {
    }

    async execute(entityManager?: EntityManager): Promise<void> {
        await this.accessRepo.grantAccess(this.userId, this.collectionId, this.level, entityManager);
    }
}
