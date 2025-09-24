import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from '#/types';
import { Logger } from '#/utils/logger';

@Injectable()
export class UserTenantActiveGuard implements CanActivate {
    private readonly logger = new Logger(UserTenantActiveGuard.name);

    constructor() {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: AuthRequest = context.switchToHttp().getRequest();

        if (!req.user) {
            return true;
        }

        if (req.user.tenant && !req.user.tenant.active) {
            this.logger.warn(`Access denied: User ${req.user.email} belongs to inactive tenant ${req.user.tenant.id}`);
            throw new UnauthorizedException('Access denied: Your organization subscription has expired');
        }

        return true;
    }
}
