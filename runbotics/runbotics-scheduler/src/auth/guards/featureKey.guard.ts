import { JwtAuthGuard } from './jwt.guard';
import { FeatureKey, IAuthority, IFeatureKey } from 'runbotics-common';
import { ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '#/types/auth-request';
import { FEATURE_KEY } from '../featureKey.decorator';

export const FeatureKeyGuardsMethod = Object.freeze({
    checkFeatureKeyAccess: (
        authorities: IAuthority[] | null,
        userFeatureKeys: IFeatureKey[] | null,
        requiredKeys: FeatureKey[]
    ): boolean => {
        if (!authorities || !userFeatureKeys) {
            return false;
        }

        const userKeys = new Set([
            ...authorities
                .flatMap((auth) => auth.featureKeys)
                .map((featureKey) => featureKey.name),
            ...userFeatureKeys.map((featureKey) => featureKey.name),
        ]);

        return requiredKeys.every((key) => userKeys.has(key));
    },
});

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
        return FeatureKeyGuardsMethod.checkFeatureKeyAccess(user.authorities, user.userFeatureKeys, featureKeys);
    }
}
