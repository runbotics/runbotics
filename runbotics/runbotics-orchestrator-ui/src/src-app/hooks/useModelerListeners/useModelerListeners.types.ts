import BpmnModeler from 'bpmn-js/lib/Modeler';

import { ModelerErrorType } from '#src-app/store/slices/Process';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';
import { Position } from '#src-app/views/process/ProcessBuildView/Modeler/templates/Template.types';

export type EventBusEvent = {
    element?: BPMNElement;
    source?: BPMNElement;
    target?: BPMNElement;
    connection?: BPMNElement;
};
export type CommandStackEvent = {
    command: string;
    context: {
        parent?: BPMNElement;
        position?: Position;
        elements?: BPMNElement[];
    } & EventBusEvent;
    id: number;
};

export interface ValidationFuncProps {
    modeler: BpmnModeler;
    element: BPMNElement;
    errorType?: ModelerErrorType;
}
