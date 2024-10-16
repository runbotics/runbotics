import { TriggerEvent } from './trigger-event.model';
import { IProcess } from './process.model';
import { IUser } from './user.model';
import { IProcessInstance } from './process-instance.model';

export interface ProcessInput {
    variables: Record<string, any>;
    callbackUrl?: string;
    queueCallbackUrl?: string;
    timeout?: number;
    clientId?: string;
}

export type Trigger = Pick<IProcessInstance, 'trigger' | 'triggerData'>;

export interface InstantProcess extends Trigger {
    process: IProcess;
    orchestratorProcessInstanceId: string;
    user?: IUser;
    input?: ProcessInput;
    isActive?: boolean;
}

export interface ScheduledProcess extends InstantProcess {
    id: number;
    cron: string;
}

export type JobData = InstantProcess & Partial<ScheduledProcess>;
