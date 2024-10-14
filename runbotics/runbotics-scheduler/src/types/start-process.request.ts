import { User } from '#/scheduler-database/user/user.entity';
import { IProcess, ProcessInput, Trigger } from 'runbotics-common';


export interface StartProcessRequest extends Trigger {
    process: IProcess;
    input: ProcessInput;
    user: User;
}
