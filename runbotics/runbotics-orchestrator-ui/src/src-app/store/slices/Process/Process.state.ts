import { IProcess, IProcessInstance } from 'runbotics-common';

import { IBpmnAction } from '#src-app/Actions/types';
import LoadingType from '#src-app/types/loading';
import { Page } from '#src-app/utils/types/page';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export interface CommandStackInfo {
    commandStackSize: number;
    commandStackIdx: number;
}
export enum ModelerErrorType {
    FORM_ERROR = 'FORM_ERROR',
    CONNECTION_ERROR = 'CONNECTION_ERROR',
    CANVAS_ERROR = 'CANVAS_ERROR'
}

export interface ModelerError {
    elementName: string;
    elementId: string;
    type: ModelerErrorType;
}

export interface ModelerState {
    appliedActivities: string[];
    errors: ModelerError[];
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

export type StartProcessResponse = Pick<
    IProcessInstance,
    'orchestratorProcessInstanceId'
>;
