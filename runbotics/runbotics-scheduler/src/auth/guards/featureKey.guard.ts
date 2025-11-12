import { JwtAuthGuard } from './jwt.guard';
import { FeatureKey } from 'runbotics-common';
import { ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types/auth-request';
import { FEATURE_KEY } from '../featureKey.decorator';
import { hasFeatureKeys } from '#/utils/user.utils';


export class FeatureKeyGuard extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
        await super.canActivate(context);

        if (super.isPublic(context)) {
            return true;
        }

        const requiredKeys =
            this.reflector.getAllAndOverride<FeatureKey[] | undefined>(
                FEATURE_KEY,
                [context.getHandler(), context.getClass()]
            ) ?? [];

        const featureKeys = [...new Set([...requiredKeys])];

        const request = context.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;

        const hasKeys = hasFeatureKeys(user, featureKeys);

        return hasKeys;
    
    }
}
