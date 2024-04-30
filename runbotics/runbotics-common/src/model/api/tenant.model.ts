import { IUser } from './user.model';

export type UserDTO = Pick<IUser, 'id' | 'login'>;

export interface Tenant {
    id?: string;
    name?: string;
    createdBy?: UserDTO;
    created?: string | null;
    updated?: string | null;
    lastModifiedBy?: string | null;
}