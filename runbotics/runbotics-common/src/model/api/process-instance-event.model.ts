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
    script?: string;
}

export interface IProcessInstanceLoopEvent extends IProcessInstanceEvent {
    iterationNumber?: number;
    loopId?: string;
    iteratorElement?: unknown[];
}

export enum ProcessInstanceEventStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ERRORED = 'ERRORED',
    STOPPED = 'STOPPED',
    TERMINATED = "TERMINATED",
}
