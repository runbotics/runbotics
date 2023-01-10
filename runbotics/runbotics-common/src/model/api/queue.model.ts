import { ProcessTrigger } from './process-trigger.model';
import { IProcess } from './process.model';
import { IUser } from './user.model';

export interface ProcessInput {
    variables: Record<string, any>;
}

export interface Trigger {
    trigger: ProcessTrigger;
    triggeredBy?: string;
}

export interface InstantProcess extends Trigger {
    process: IProcess;
    user?: IUser;
    input?: ProcessInput;
    isActive?: boolean;
}

export interface ScheduledProcess extends InstantProcess {
    id: number;
    cron: string;
}
