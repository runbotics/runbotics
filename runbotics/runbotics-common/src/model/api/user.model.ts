import { IAuthority } from './authority.model';
import { UserProcess } from './user-process.model';

export interface IUser {
    id?: number;
    login?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    activated?: boolean;
    langKey?: string;
    authorities?: IAuthority[];
    createdBy?: string;
    createdDate?: string | null;
    lastModifiedBy?: string;
    lastModifiedDate?: string | null;
    password?: string;
    notifications?: UserProcess[];
}
