import React, { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import { FeatureKey, Role } from 'runbotics-common';
import useAuth from 'src/hooks/useAuth';
import { User } from 'src/types/user';

export interface SecuredProps {
    authorities?: Role[];
    featureKeys?: FeatureKey[];
    children?: ReactNode;
}

export const hasAuthorities = (user: User, authorities: any[]) => {
    if (!user || !user.authoritiesById) {
        return false;
    }
    for (const authority of authorities) {
        if (!user.authoritiesById[authority]) {
            return false;
        }
    }

    return true;
};

export const hasRoleAccess = (user: User, roles: Role[]) => {
    if (!user || !user.roles) {
        return false;
    }

    for (const role of roles) {
        if (!user.roles.includes(role)) {
            return false;
        }
    }

    return true;
};

export const hasFeatureKeyAccess = (user: User, featureKeys: FeatureKey[]) => {
    if (!user || !user.featureKeys || !user.roles) {
        return false;
    }

    for (const featureKey of featureKeys) {
        if (!user.featureKeys.includes(featureKey)) {
            return false;
        }
    }

    return true;
};

const Secured: FC<SecuredProps> = ({ children, featureKeys }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (featureKeys) {
            if (hasFeatureKeyAccess(user, featureKeys)) {
                return <>{children}</>;
            }
            return <Redirect to="/404" />;
        }

        return <>{children}</>;
    }
    return <Redirect to="/404" />;
};

export default Secured;
