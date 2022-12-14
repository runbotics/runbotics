import { IProcess, IProcessInstance } from 'runbotics-common';

import LoadingType from '#src-app/types/loading';
import { Page } from '#src-app/utils/types/page';

export interface CommandStackInfo {
    commandStackSize: number;
    commandStackIdx: number
}

export interface ModelerState {
    appliedActivities: string[];
    isSaveDisabled: boolean;
}

export interface ProcessState {
    draft: {
        process: IProcess;
        loading: LoadingType;
        currentRequestId: any;
        error: any;
    };
    modeler: ModelerState;
    all: {
        loading: boolean;
        byId: Record<string, IProcess>;
        ids: string[];
        page: Page<IProcess> | null;
    };
}

export type StartProcessResponse = Pick<IProcessInstance, 'orchestratorProcessInstanceId'>;
