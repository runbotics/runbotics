import { IProcess, IProcessInstance } from 'runbotics-common';
import BpmnModelerType from 'bpmn-js/lib/Modeler';

import LoadingType from '#src-app/types/loading';
import { Page } from '#src-app/utils/types/page';
import { IBpmnAction } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Actions/types';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/BPMN';

export interface CommandStackInfo {
    commandStackSize: number;
    commandStackIdx: number
}

export interface ModelerState {
    appliedActivities: string[];
    isSaveDisabled: boolean;
    selectedElement?: BPMNElement;
    selectedAction?: IBpmnAction;
    passedInVariables?: string[];
    commandStack: CommandStackInfo;
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
