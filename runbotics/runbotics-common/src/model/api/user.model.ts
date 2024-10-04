import { IAuthority } from './authority.model';
import { BasicTenantDto } from './tenant.model';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    langKey: string;
    activated: boolean;
    activationKey: string | null;
    resetKey: string | null;
    createdBy: string;
    createdDate: string;
    resetDate: string | null;
    lastModifiedDate: string;
    lastModifiedBy: string;
    tenantId: string;
}

export type BasicUserDto = Pick<User, 'id' | 'email'>;

export type PartialUserDto = Partial<User>;

export type UserDto = Omit<User, 'activationKey' | 'resetKey' | 'tenantId'> & {
    tenant: BasicTenantDto;
    authorities: IAuthority[];
}
