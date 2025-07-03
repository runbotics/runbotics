import { Injectable } from '@nestjs/common';
import { BaseAuthorizationHandler } from './base-authorization.handler';
import { Role } from 'runbotics-common';
import { AuthRequest } from '#/types';
import { hasRole } from '#/utils/authority.utils';
import { Logger } from '#/utils/logger';

@Injectable()
export class TenantAdminHandler extends BaseAuthorizationHandler {
    private readonly logger = new Logger(TenantAdminHandler.name);

    async handle(request: AuthRequest, _collectionId?: number): Promise<boolean> {
        if (hasRole(request.user, Role.ROLE_TENANT_ADMIN)) {
            this.logger.log(`Authorized by tenant admin handler for ${request.user.id}`);
            return true;
        }
        return super.handle(request);
    }
}
