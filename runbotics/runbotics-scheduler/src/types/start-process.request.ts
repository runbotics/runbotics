import { IProcess, ProcessInput, Trigger, User } from 'runbotics-common';


export interface StartProcessRequest extends Trigger {
    process: IProcess;
    input: ProcessInput;
    user: User;
}
