import { Page } from 'src/utils/types/page';
import LoadingType from 'src/types/loading';
import { IProcess, IProcessInstance } from 'runbotics-common';

export interface ProcessState {
    draft: {
        process: IProcess;
        loading: LoadingType;
        currentRequestId: any;
        error: any;
    };
    modeler: {
        appliedActivites: string[];
    }
    all: {
        loading: boolean;
        byId: Record<string, IProcess>;
        ids: string[];
        page: Page<IProcess> | null;
    };
}

export type StartProcessResponse = Pick<IProcessInstance, 'orchestratorProcessInstanceId'>;
