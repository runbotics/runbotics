import { PermissionOperationType } from './permission-operation-type.enum';
import { PermissionStrategy } from './strategies/permission-strategy.interface';
import { PermissionRepository } from './permission-management.repository';
import { GrantPermissionStrategy } from './strategies/grant-permission.strategy';
import { PrivilegeType } from 'runbotics-common';
import { RevokePermissionStrategy } from './strategies/revoke-permission.strategy';
import { UpdatePermissionStrategy } from './strategies/update-permission.strategy';

export class PermissionStrategyFactory {
    static createStrategy(
        type: PermissionOperationType,
        userId: number,
        collectionId: string,
        permissionRepository: PermissionRepository,
        permissionLevel?: PrivilegeType,
    ): PermissionStrategy {
        switch (type) {
            case PermissionOperationType.GRANT:
                return new GrantPermissionStrategy(userId, collectionId, permissionLevel!, permissionRepository);
            case PermissionOperationType.REVOKE:
                return new RevokePermissionStrategy(userId, collectionId, permissionRepository);
            case PermissionOperationType.UPDATE:
                return new UpdatePermissionStrategy(userId, collectionId, permissionLevel!, permissionRepository);
            default:
                throw new Error('Invalid access operation type');
        }
    }
}
