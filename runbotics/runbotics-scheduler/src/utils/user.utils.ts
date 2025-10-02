import { User } from '#/scheduler-database/user/user.entity';
import { IAuthority, IFeatureKey, FeatureKey } from 'runbotics-common';

export function getAllFeatureKeysAssignedToUser(
    authorities: IAuthority[],
    userFeatureKeys: IFeatureKey[]
): FeatureKey[] {
    return Array.from(
        new Set([
            ...authorities
                .flatMap((auth) => auth.featureKeys)
                .map((featureKey) => featureKey.name),
            ...userFeatureKeys.map((featureKey) => featureKey.name),
        ])
    );
}

export function hasFeatureKeys(user: User, requiredFeatureKeys: FeatureKey[]): boolean {
    if (requiredFeatureKeys.length === 0) return true;

    const allUserFeatureKeys = getAllFeatureKeysAssignedToUser(
        user.authorities,
        user.userFeatureKeys
    );

    return requiredFeatureKeys.every((key) => allUserFeatureKeys.includes(key));
}

export function hasFeatureKey(user: User, requiredFeatureKeys: FeatureKey) {
    const userFeatureKeys = getAllFeatureKeysAssignedToUser(
        user.authorities,
        user.userFeatureKeys
    );

    return userFeatureKeys.includes(requiredFeatureKeys);
}
