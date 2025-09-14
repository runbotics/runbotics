import { Injectable } from '@nestjs/common';
import { PermissionOperationType } from './permission-operation-type.enum';
import { PermissionStrategyFactory } from './permission-management.factory';
import { PermissionRepository } from './permission-management.repository';
import { PrivilegeType } from 'runbotics-common';
import { EntityManager } from 'typeorm';

@Injectable()
export class PermissionManagementService {
    constructor(private readonly permissionRepository: PermissionRepository) {
    }

    async getPermissionByCollectionId(collectionId: string) {
        return this.permissionRepository.getAccessByCollectionId(collectionId);
    }
    
    async grant(userId: number, collectionId: string, level: PrivilegeType, entityManager?: EntityManager) {
        const strategy = PermissionStrategyFactory.createStrategy(
            PermissionOperationType.GRANT,
            userId,
            collectionId,
            this.permissionRepository,
            level,
        );
        await strategy.execute(entityManager);
    }

    async revoke(userId: number, collectionId: string, entityManager?: EntityManager) {
        const strategy = PermissionStrategyFactory.createStrategy(
            PermissionOperationType.REVOKE,
            userId,
            collectionId,
            this.permissionRepository,
        );
        await strategy.execute(entityManager);
    }

    async update(userId: number, collectionId: string, level: PrivilegeType, entityManager?: EntityManager) {
        const strategy = PermissionStrategyFactory.createStrategy(
            PermissionOperationType.UPDATE,
            userId,
            collectionId,
            this.permissionRepository,
            level,
        );
        await strategy.execute(entityManager);
    }
}
