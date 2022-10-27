import { IProcess } from 'runbotics-common';

import { IBot } from './bot.model';
import ProcessInstanceStatus from './enumerations/process-instance-status.model';

export interface IProcessInstance {
    id?: string;
    orchestratorProcessInstanceId?: string | null;
    rootProcessInstanceId?: string | null;
    status?: ProcessInstanceStatus | null;
    created?: Date | null;
    updated?: Date | null;
    input?: string | null;
    output?: string | null;
    step?: string | null;
    process?: IProcess;
    bot?: IBot;
    scheduled?: boolean;
}

export interface ProcessInstanceRow extends IProcessInstance {
    path?: string[];
}

export const defaultValue: Readonly<IProcessInstance> = {};
