import React, { FC, ReactNode } from 'react';

import { FeatureKey, Role, UserDto } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import { AuthState } from '#src-app/store/slices/Auth';

export interface SecuredProps {
    authorities?: Role[];
    featureKeys?: FeatureKey[];
    children?: ReactNode;
}

export interface AccessUtility {
    oneOf?: boolean;
}

export const hasAuthorities = (user: AuthState['user'], authorities: any[]) => {
    if (!user || !user.authoritiesById)
    { return false; }

    for (const authority of authorities)
    { if (!user.authoritiesById[authority])
    { return false; } }



    return true;
};

export const hasRoleAccess = (user: UserDto, roles: Role[]) => {
    if (roles.length === 0) return true;

    if (!user || !user.roles) return false;

    if (!roles.some(role => user.roles.includes(role))) return false;

    return true;
};

export const hasOnlyRole = (user: UserDto, role: Role) => {
    if (!user || !user.roles) return false;
    return user.roles.length === 1 && user.roles[0] === role;
};

export const hasRoles = (user: UserDto) => {
    if (!user) {
        return {
            isTenantAdmin: false,
            isAdmin: false,
            isGuest: false,
            isOnlyRoleUser: false,
            isOnlyRoleRpaUser: false,
        };
    }

    const isTenantAdmin = hasRoleAccess(user, [Role.ROLE_TENANT_ADMIN]);
    const isAdmin = hasRoleAccess(user, [Role.ROLE_ADMIN]);
    const isGuest = hasRoleAccess(user, [Role.ROLE_GUEST]);
    const isOnlyRoleUser = hasOnlyRole(user, Role.ROLE_USER);
    const isOnlyRoleRpaUser = hasOnlyRole(user, Role.ROLE_RPA_USER);
    return {
        isTenantAdmin,
        isAdmin,
        isGuest,
        isOnlyRoleUser,
        isOnlyRoleRpaUser,
    };
};

export const hasFeatureKeyAccess = (user: UserDto, featureKeys: FeatureKey[], options?: AccessUtility) => {
    if (featureKeys.length === 0) return true;

    if (!user || !user.featureKeys || !user.roles) {
        return false;
    }

    return options && options.oneOf
        ? featureKeys.some(featureKey => user.featureKeys.includes(featureKey))
        : featureKeys.every(featureKey => user.featureKeys.includes(featureKey));
};

const Secured: FC<SecuredProps> = ({ children, featureKeys }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (featureKeys)
        { if (hasFeatureKeyAccess(user, featureKeys))
        { return <>{children}</>; } }



        return <>{children}</>;
    }
    return <></>;
};

export default Secured;
