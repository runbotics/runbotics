import { IUser } from 'runbotics-common';
import { ProcessInput } from './instant-process';

export interface StartProcessRequest {
    processInfo: string;
    input: ProcessInput;
    user: IUser;
}