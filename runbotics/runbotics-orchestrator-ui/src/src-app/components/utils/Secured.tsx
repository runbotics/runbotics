import React, { FC, ReactNode } from 'react';

import { FeatureKey, Role } from 'runbotics-common';

import useAuth from '#src-app/hooks/useAuth';
import { User } from '#src-app/types/user';

export interface SecuredProps {
    authorities?: Role[];
    featureKeys?: FeatureKey[];
    children?: ReactNode;
}

export interface AccessUtility {
    oneOf?: boolean;
}

export const hasAuthorities = (user: User, authorities: any[]) => {
    if (!user || !user.authoritiesById) 
    { return false; }
    
    for (const authority of authorities) 
    { if (!user.authoritiesById[authority]) 
    { return false; } }
        
    

    return true;
};

export const hasRoleAccess = (user: User, roles: Role[]) => {
    if (!user || !user.roles) 
    { return false; }
    

    for (const role of roles) 
    { if (!user.roles.includes(role)) 
    { return false; } }
        
    

    return true;
};

export const hasFeatureKeyAccess = (user: User, featureKeys: FeatureKey[], options?: AccessUtility) => {
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
