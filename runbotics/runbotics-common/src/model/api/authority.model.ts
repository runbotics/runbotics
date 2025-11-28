import { IFeatureKey } from "./feature-key.model";

export enum Role {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_TENANT_ADMIN = 'ROLE_TENANT_ADMIN',
    ROLE_RPA_USER = 'ROLE_RPA_USER',
    ROLE_EXTERNAL_USER = 'ROLE_EXTERNAL_USER',
    ROLE_GUEST = 'ROLE_GUEST',
    ROLE_USER = 'ROLE_USER',
    ROLE_SERVICE_ACCOUNT = 'ROLE_SERVICE_ACCOUNT',
}

export const availableRoles: Role[] = Object.values(Role).filter(
    (role) => role !== Role.ROLE_SERVICE_ACCOUNT
);

export interface IAuthority {
    name: Role;
    featureKeys: IFeatureKey[]
}
