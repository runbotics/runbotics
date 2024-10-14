import { BasicUserDto, User } from './user.model';

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
    user: User;
    creator?: BasicUserDto | null;
}
