import { ProcessInput, Trigger, IProcess, IUser } from 'runbotics-common';

export interface StartProcessRequest extends Trigger {
    process: IProcess;
    input: ProcessInput;
    user: IUser;
}
