import { IFeatureKey } from "./feature-key.model";

export enum Role {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_TENANT_ADMIN = 'ROLE_TENANT_ADMIN',
    ROLE_RPA_USER = 'ROLE_RPA_USER',
    ROLE_EXTERNAL_USER = 'ROLE_EXTERNAL_USER',
    ROLE_GUEST = 'ROLE_GUEST',
}

export interface IAuthority {
    name: Role;
    featureKeys: IFeatureKey[]
}
