import { PermissionStrategy } from './permission-strategy.interface';
import { PermissionRepository } from '../permission-management.repository';
import { PrivilegeType } from 'runbotics-common';
import { EntityManager } from 'typeorm';

export class UpdatePermissionStrategy implements PermissionStrategy {
    constructor(
        private readonly userId: number,
        private readonly collectionId: string,
        private readonly newLevel: PrivilegeType,
        private readonly permissionRepository: PermissionRepository,
    ) {
    }
    //TODO: Implement function based on changes in ProcessCollection not only ProcessCollectionUser table to recreate tree
    async execute(entityManager?: EntityManager): Promise<void> {
        
        // 1. Zapamiętaj stan (można logować do audytu)
        const previous = await this.permissionRepository.getUserAccess(this.userId, this.collectionId);

        // 2. Wyczyść stare dane
        await this.permissionRepository.revokeAccess(this.userId, this.collectionId, entityManager);

        // 3. Zaktualizuj konkretne pola (tu akurat grant działa jako insert/update)
        await this.permissionRepository.grantAccess(this.userId, this.collectionId, this.newLevel, entityManager);

        // 4. Ewentualnie odbuduj zależności — np. reindex, notyfikacje
        // Można dodać np. this.rebuildIndex(this.userId, this.collectionId)
    }
}
