import BpmnModeler from 'bpmn-js/lib/Modeler';

export interface ActionListPanelProps {
    modeler: BpmnModeler;
    offsetTop: number | null;
}

export interface FilterModalState {
    anchorElement: Element | null;
    filters: string[];
}

export enum ListPanelTab {
    ACTIONS = 'ACTIONS',
    TEMPLATES = 'TEMPLATES',
}