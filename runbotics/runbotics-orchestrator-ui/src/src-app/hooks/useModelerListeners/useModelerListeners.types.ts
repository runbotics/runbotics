import { Dispatch, SetStateAction } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import { CommandStackInfo, ModelerErrorType } from '#src-app/store/slices/Process';
import { ProcessBuildTab } from '#src-app/types/sidebar';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';
import { Position } from '#src-app/views/process/ProcessBuildView/Modeler/templates/Template.types';

export interface EventBusEvent {
    element?: BPMNElement;
    source?: BPMNElement;
    target?: BPMNElement;
    connection?: BPMNElement;
}
export interface EventContext extends EventBusEvent {
    parent?: BPMNElement;
    position?: Position;
    elements?: BPMNElement[];
}
export interface CommandStackEvent {
    command: string;
    trigger: string;
    context: EventContext;
    id: number;
}

export interface ValidationFuncProps {
    modeler: BpmnModeler;
    element: BPMNElement;
    errorType?: ModelerErrorType;
}

export interface ModelerListenersProps {
    setCurrentTab: Dispatch<SetStateAction<ProcessBuildTab>>;
}

export interface ValidateElementProps {
    element: BPMNElement;
    handleValidElement: (props: ValidationFuncProps) => void;
    handleInvalidElement: (props: ValidationFuncProps) => void;
    modeler: BpmnModeler;
}

export interface IsModelerSyncProps {
    modeler: BpmnModeler;
    appliedActivities: string[];
    imported: boolean;
    commandStack: CommandStackInfo,
    errors: ModelerErrorType,
}
