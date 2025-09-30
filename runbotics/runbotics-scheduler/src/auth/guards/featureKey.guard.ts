import { JwtAuthGuard } from './jwt.guard';
import { FeatureKey } from 'runbotics-common';
import { ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types/auth-request';
import { FEATURE_KEY } from '../featureKey.decorator';

export class FeatureKeyGuard extends JwtAuthGuard {

    async canActivate(context: ExecutionContext) {
        await super.canActivate(context);

        if (super.isPublic(context)) {
            return true;
        }

        const requiredKeys = this.reflector.getAllAndOverride<FeatureKey[] | undefined>(FEATURE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];

        const featureKeys = [...new Set([...requiredKeys])];

        const request = context.switchToHttp().getRequest<AuthRequest>();
        const user = request.user;
        const userKeys = new Set([
            ...user.authorities.flatMap((auth) => auth.featureKeys).map((featureKey) => featureKey.name),
            ...user.userFeatureKeys.map((featureKey) => featureKey.name)
        ]);
    
        return featureKeys.every((key) => userKeys.has(key));
    }
}
