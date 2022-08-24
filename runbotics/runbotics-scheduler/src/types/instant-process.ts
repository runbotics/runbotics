import { IProcess, IUser } from 'runbotics-common';

export interface ProcessInput {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: Record<string, any>;
}

export interface InstantProcess {
    process: IProcess;
    user: IUser;
    input?: ProcessInput;
    isActive?: boolean;
}
