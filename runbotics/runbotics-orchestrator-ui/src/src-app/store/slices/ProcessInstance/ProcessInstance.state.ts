import { IProcessInstance, IProcessInstanceEvent } from 'runbotics-common';

import { Page } from '#src-app/utils/types/page';

export interface ProcessInstanceState {
    active: {
        orchestratorProcessInstanceId: string | null;
        processInstance: IProcessInstance | null;
        eventsMap: Record<string, IProcessInstanceEvent>;
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
