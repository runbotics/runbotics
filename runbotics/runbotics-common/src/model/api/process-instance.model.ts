import { IProcess } from "./process.model";
import { IBot } from "./bot.model";
import { IUser } from "./user.model";
import { IProcessTrigger } from './process-trigger.model';

export interface IProcessInstance {
    id?: string;
    orchestratorProcessInstanceId?: string | null;
    rootProcessInstanceId?: string;
    status?: ProcessInstanceStatus | null;
    created?: string | null;
    updated?: string | null;
    input?: string | null;
    output?: string | null;
    step?: string | null;
    user?: IUser;
    process?: IProcess;
    bot?: IBot;
    error?: string | null;
    trigger?: IProcessTrigger;
    triggeredBy?: string;
    subProcesses?: IProcess[];
}

export enum ProcessInstanceStatus {
    INITIALIZING = 'INITIALIZING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ERRORED = 'ERRORED',
    STOPPED = 'STOPPED',
    TERMINATED = "TERMINATED",
}

export const defaultValue: Readonly<IProcessInstance> = {};
