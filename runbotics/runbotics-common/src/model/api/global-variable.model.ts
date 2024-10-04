import { BasicUserDto, UserDto } from './user.model';

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
    user: UserDto;
    creator?: BasicUserDto | null;
}
