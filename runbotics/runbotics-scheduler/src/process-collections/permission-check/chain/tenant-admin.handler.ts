import { Injectable } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { Role } from 'runbotics-common';
import { AuthRequest } from '#/types';
import { hasRole } from '#/utils/authority.utils';

@Injectable()
export class TenantAdminHandler extends BaseAuthorizationHandler {
    async handle(request: AuthRequest, _collectionId?: number): Promise<boolean> {
        if (hasRole(request.user, Role.ROLE_TENANT_ADMIN)) {
            return true;
        }
        return super.handle(request);
    }
}
