import { LoopProps } from './loop-props';
import { IProcessInstance } from './process-instance.model';

export interface IProcessInstanceEvent {
    id?: number;
    created?: string | null;
    log?: string | null;
    step?: string | null;
    processInstance?: IProcessInstance | null;
    executionId?: string | null;
    input?: string | null;
    output?: string | null;
    finished?: string | null;
    status?: ProcessInstanceEventStatus | null;
    error?: string | null;
    loopProps?: LoopProps | null;
}

export enum ProcessInstanceEventStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ERRORED = 'ERRORED',
    STOPPED = 'STOPPED',
    TERMINATED = "TERMINATED",
}

export const defaultValue: Readonly<IProcessInstanceEvent> = {};
