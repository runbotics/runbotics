import { IProcess, IUser, ProcessTrigger } from 'runbotics-common';

export interface ProcessInput {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: Record<string, any>;
}

export interface InstantProcess extends Trigger {
    process: IProcess;
    user: IUser | null;
    input?: ProcessInput;
    isActive?: boolean;
}

export interface Trigger {
    trigger: ProcessTrigger;
    triggeredBy?: string;
}
