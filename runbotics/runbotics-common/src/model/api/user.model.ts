import { IAuthority, Role } from './authority.model';
import { FeatureKey } from './feature-key.model';
import { BasicTenantDto } from './tenant.model';

export interface User {
    id: number;
    email: string;
    passwordHash?: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
    langKey: string;
    activated: boolean;
    hasBeenActivated: boolean;
    activationKey?: string | null;
    resetKey?: string | null;
    createdBy: string;
    createdDate: string;
    resetDate: string | null;
    lastModifiedDate: string;
    lastModifiedBy: string;
    tenantId: string;
    authorities: IAuthority[];
}

export type BasicUserDto = Pick<User, 'id' | 'email'>;

export type PartialUserDto = Partial<User>;

export type UserDto = Omit<
    User,
    | 'activationKey'
    | 'resetDate'
    | 'resetKey'
    | 'tenantId'
    | 'passwordHash'
    | 'authorities'
> & {
    tenant: BasicTenantDto;
    roles: Role[];
    featureKeys: FeatureKey[];
};

export type ActivateUserDto = {
    id: number
    roles: Role[],
    message?: string
    tenantId: string
}
