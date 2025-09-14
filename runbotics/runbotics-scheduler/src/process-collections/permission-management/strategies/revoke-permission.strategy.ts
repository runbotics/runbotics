import { PermissionRepository } from '#/process-collections/permission-management/permission-management.repository';
import {
    PermissionStrategy
} from '#/process-collections/permission-management/strategies/permission-strategy.interface';
import { EntityManager } from 'typeorm';

export class RevokePermissionStrategy implements PermissionStrategy {
    constructor(
        private readonly userId: number,
        private readonly collectionId: string,
        private readonly accessRepo: PermissionRepository,
    ) {}
    
    async execute(entityManager?: EntityManager): Promise<void> {
        await this.accessRepo.revokeAccess(this.userId, this.collectionId, entityManager);
    }
}
