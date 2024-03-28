import { IProcess, IProcessInstance, IProcessInstanceEvent } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

type ProcessId = IProcess['id'];

type ActiveInfo = {
    orchestratorProcessInstanceId: string | null;
    processInstance: IProcessInstance | null;
}

type AllActiveMap = Record<ProcessId, ActiveInfo>;

export type Job = {
    jobId: string | number | null;
    jobIndex: number | null;
    isProcessing: boolean;
    errorMessage: string | null;
}

export interface ProcessInstanceState {
    allActiveMap: AllActiveMap;
    active: {
        orchestratorProcessInstanceId: string | null;
        processInstance: IProcessInstance | null;
        eventsMap: Record<string, IProcessInstanceEvent>;
        job: Job | null;
    };
    all: {
        loading: boolean;
        loadingPage: boolean;
        byId: Record<string, IProcessInstance>;
        byProcessId: Record<number, IProcessInstance[]>;
        ids: string[];
        page: Page<InstanceExtendedWithSubprocesses> | null;
    };
}

export interface ProcessInstanceRequestCriteria extends Omit<IProcessInstance, 'process' | 'bot'> {
    botId?: number;
    processId?: number;
}

export interface InstanceExtendedWithSubprocesses extends IProcessInstance {
    hasSubprocesses?: boolean;
    isLoadingSubprocesses?: boolean;
    subprocesses?: IProcessInstance[];
}
