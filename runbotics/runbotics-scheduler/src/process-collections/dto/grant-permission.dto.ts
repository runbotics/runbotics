import { PrivilegeType } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import { AuthRequest } from '#/types';

export class GrantPermissionRequest {
    userId: number;
    collectionId: string;
    privilegeType: PrivilegeType;
}

export class GrantPermissionData extends GrantPermissionRequest {
    user: User;
    tenantId: string;
    req: AuthRequest;
}
