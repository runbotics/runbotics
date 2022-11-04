import { IProcessInstance, IProcessInstanceEvent } from 'runbotics-common';

import { Page } from 'src/utils/types/page';

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
        page: Page<IProcessInstance> | null;
    };
}

export interface ProcessInstanceRequestCriteria extends Omit<IProcessInstance, 'process' | 'bot'> {
    botId?: number;
    processId?: number;
}
