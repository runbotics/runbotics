import { Injectable } from '@nestjs/common';
import { PermissionOperationType } from './permission-operation-type.enum';
import { PermissionStrategyFactory } from './permission-management.factory';
import { PermissionRepository } from './permission-management.repository';
import { PrivilegeType } from 'runbotics-common';

@Injectable()
export class PermissionManagementService {
    constructor(private readonly permissionRepository: PermissionRepository) {
    }

    async grant(userId: number, collectionId: number, level: PrivilegeType) {
        const strategy = PermissionStrategyFactory.createStrategy(
            PermissionOperationType.GRANT,
            userId,
            collectionId,
            this.permissionRepository,
            level,
        );
        await strategy.execute();
    }

    async revoke(userId: number, collectionId: number) {
        const strategy = PermissionStrategyFactory.createStrategy(
            PermissionOperationType.REVOKE,
            userId,
            collectionId,
            this.permissionRepository,
        );
        await strategy.execute();
    }

    async update(userId: number, collectionId: number, level: PrivilegeType) {
        const strategy = PermissionStrategyFactory.createStrategy(
            PermissionOperationType.UPDATE,
            userId,
            collectionId,
            this.permissionRepository,
            level,
        );
        await strategy.execute();
    }
}
