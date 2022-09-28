import BpmnModeler from 'bpmn-js/lib/Modeler';
import { IBpmnAction } from '../ConfigureActionPanel/Actions/types';
import { TemplatesSchema } from '../ConfigureActionPanel/Template.types';

export interface ActionListPanelProps {
    modeler: BpmnModeler;
    offsetTop: number | null;
}

export interface FilterModalState {
    anchorElement: Element | null;
    groupNames: string[];
    actionName: string;
}

export enum ListPanelTab {
    ACTIONS = 'ACTIONS',
    TEMPLATES = 'TEMPLATES',
}

export type GroupProperties = readonly [string, { label: string; items: IBpmnAction[] | TemplatesSchema[] }];
