import { JwtAuthGuard } from './jwt.guard';
import { ROLES_KEY } from '../roles.decorator';
import { Role } from 'runbotics-common';
import { ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types/auth-request';

export class RoleGuard extends JwtAuthGuard {

    async canActivate(context: ExecutionContext) {
        await super.canActivate(context);

        if (super.isPublic(context)) {
            return true;
        }

        const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];

        const authorizationRoles = [...new Set([...requiredRoles,])];

        const request = context.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;
        const roles = user.authorities.map((auth) => auth.name);

        return authorizationRoles.every((role) => roles.includes(role));
    }
}
