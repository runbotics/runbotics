import { IProcessInstance, ProcessInstanceEventStatus } from 'runbotics-common';
export interface IProcessInstanceEvent {
    id?: number;
    created?: string | null;
    log?: string | null;
    processInstance?: IProcessInstance | null;
    step?: string | null;
    executionId?: string | null;
    input?: string | null;
    output?: string | null;
    finished?: Date | null;
    status?: ProcessInstanceEventStatus | null;
}

export const defaultValue: Readonly<IProcessInstanceEvent> = {};
