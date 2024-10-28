import { IUser, UserDTO } from './user.model';

export enum GlobalVariableType {
    LIST = 'LIST',
    STRING = 'STRING',
    BOOLEAN = 'BOOLEAN'
}

export interface IGlobalVariable {
    id: number;
    name: string;
    description: string | null;
    type: GlobalVariableType;
    value: string;
    lastModified: string;
    user: IUser;
    creator?: UserDTO | null;
}
