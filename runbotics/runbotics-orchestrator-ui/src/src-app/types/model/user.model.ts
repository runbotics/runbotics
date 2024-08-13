export interface IUser {
    id?: any;
    login?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    activated?: boolean;
    langKey?: string;
    authorities?: any[];
    createdBy?: string;
    createdDate?: Date | null;
    lastModifiedBy?: string;
    lastModifiedDate?: Date | null;
    password?: string;
    roles?: string[];
}

export type UserDTO = Pick<IUser, 'id' | 'login'>;

export const defaultValue: Readonly<IUser> = {
    id: '',
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    activated: true,
    langKey: '',
    authorities: [],
    createdBy: '',
    createdDate: null,
    lastModifiedBy: '',
    lastModifiedDate: null,
    password: '',
};
