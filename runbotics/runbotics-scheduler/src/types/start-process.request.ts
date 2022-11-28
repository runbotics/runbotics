import { IProcess, IUser } from 'runbotics-common';
import { ProcessInput, Trigger } from './instant-process';

export interface StartProcessRequest extends Trigger {
    process: IProcess;
    input: ProcessInput;
    user: IUser;
}