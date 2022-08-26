import { IProcess, IUser } from 'runbotics-common';
import { ProcessInput } from './instant-process';

export interface StartProcessRequest {
    process: IProcess;
    input: ProcessInput;
    user: IUser;
}