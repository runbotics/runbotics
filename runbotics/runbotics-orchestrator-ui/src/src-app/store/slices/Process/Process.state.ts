import { IProcess, IProcessInstance, NotificationProcess, ProcessCredential } from 'runbotics-common';

import { IBpmnAction } from '#src-app/Actions/types';
import { Options, Variable } from '#src-app/hooks/useOptions';
import LoadingType from '#src-app/types/loading';
import { Page } from '#src-app/utils/types/page';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export interface CommandStackInfo {
    commandStackSize: number;
    commandStackIdx: number;
}
type ElementId = string;
export enum ModelerErrorType {
    FORM_ERROR = 'FORM_ERROR',
    CONNECTION_ERROR = 'CONNECTION_ERROR',
    CANVAS_ERROR = 'CANVAS_ERROR'
}

export interface ModelerError {
    elementName: string;
    elementId: ElementId;
    type: ModelerErrorType;
    relatedElements?: ElementId[];
}

export interface ModelerState {
    appliedActivities: string[];
    errors: ModelerError[];
    customValidationErrors: ModelerError[];
    options: Options;
    variables: Variable[];
    isSaveDisabled: boolean;
    selectedElement?: BPMNElement;
    currentProcessOutputElement?: BPMNElement;
    selectedAction?: IBpmnAction;
    passedInVariables?: string[];
    commandStack: CommandStackInfo;
    imported: boolean;
    activeDrag: boolean;
}

export interface ProcessState {
    draft: {
        process: IProcess;
        loading: LoadingType;
        currentRequestId: any;
        error: any;
        processSubscriptions: NotificationProcess[];
        credentials: ProcessCredential[];
    };
    modeler: ModelerState;
    all: {
        loading: boolean;
        byId: Record<string, IProcess>;
        ids: string[];
        page: Page<IProcess> | null;
    };
}

export interface UpdateDiagramRequest {
    id?: number;
    definition?: string | null;
    globalVariableIds?: string[];
    executionInfo?: string | null;
}

export interface CreateProcessCredentialDto {
    credentialId: string;
    templateName: string;
    processId: string;
}

export type StartProcessResponse = Pick<
    IProcessInstance,
    'orchestratorProcessInstanceId'
>;
