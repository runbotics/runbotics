import { IFeatureKey } from "./feature-key.model";

export enum Role {
    ROLE_ADMIN = 'ROLE_ADMIN',
    ROLE_USER = 'ROLE_USER',
}

export interface IAuthority {
    name: Role;
    featureKeys: IFeatureKey[]
}
