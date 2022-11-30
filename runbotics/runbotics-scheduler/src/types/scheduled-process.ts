import { IProcess, IUser } from 'runbotics-common';

export interface ValidateProcessAccessProps {
    process: IProcess,
    user?: IUser,
    triggered?: boolean
}