import { Dispatch, SetStateAction } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';

import {
    CommandStackInfo,
    ModelerError,
    ModelerErrorType,
} from '#src-app/store/slices/Process';
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
    shape?: BPMNElement;
}
export interface CommandStackEvent {
    command: string;
    trigger: string;
    context: EventContext;
    shape?: BPMNElement;
    id: number;
}

export interface ModelerElementValidationParams {
    modeler: BpmnModeler;
    element: BPMNElement;
    errorType?: ModelerErrorType;
}

export interface ModelerListenerHookProps {
    setCurrentTab: Dispatch<SetStateAction<ProcessBuildTab>>;
}

export interface ValidateElementProps {
    element: BPMNElement;
    handleValidElement: (props: ModelerElementValidationParams) => void;
    handleInvalidElement: (props: ModelerElementValidationParams) => void;
    modeler: BpmnModeler;
}

export interface ValidateStartEventProps {
    context: CommandStackEvent['context'];
    modeler: BpmnModeler;
    handleInvalidElement: (
        props: ModelerElementValidationParams & { nameKey: string }
    ) => void;
}

export interface ValidateStartEventsProps {
    handleInvalidElement: (props: {
        elementId: string;
        nameKey: string;
        errorType: ModelerErrorType;
    }) => void;
    handleValidElement: (props: { elementId: string }) => void;
    modeler: BpmnModeler;
}

export interface ModelerSyncParams {
    modeler: BpmnModeler;
    appliedActivities: string[];
    imported: boolean;
    commandStack: CommandStackInfo;
    errors: ModelerError[];
}
