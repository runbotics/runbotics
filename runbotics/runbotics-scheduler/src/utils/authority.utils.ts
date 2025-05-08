import { FeatureKey, Role } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';

export const isTenantAdmin = (user: User) => user.authorities.some(authority => authority.name === Role.ROLE_TENANT_ADMIN);

export const isAdmin = (user: User) => user.authorities.some(authority => authority.name === Role.ROLE_ADMIN);

export const hasRole = (user: User, role: Role): boolean => {
    const userRoles = user.authorities
            .map((authority) => authority.name);

    return userRoles.includes(role);
};

export const hasFeatureKey = (user: User, featureKey: FeatureKey) => {
    const userFeatureKeys = user.authorities
            .flatMap((authority) => authority.featureKeys)
            .map((key) => key.name);

    const hasFeatureKey = userFeatureKeys.includes(featureKey);

    return hasFeatureKey;
};
