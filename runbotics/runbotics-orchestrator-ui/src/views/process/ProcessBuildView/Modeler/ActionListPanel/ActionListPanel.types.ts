import BpmnModeler from 'bpmn-js/lib/Modeler';

import { IBpmnAction } from '../ConfigureActionPanel/Actions/types';
import { TemplatesSchema } from '../ConfigureActionPanel/Template.types';

export enum ListPanelTab {
    ACTIONS = 'ACTIONS',
    TEMPLATES = 'TEMPLATES',
}

export interface ActionListPanelProps {
    modeler: BpmnModeler;
    offsetTop: number | null;
}

export interface Filters {
    groupNames: string[];
    actionName: string;
    currentTab: ListPanelTab;
}

export type GroupProperties = {
    key: string;
    label: string;
    items: IBpmnAction[] | TemplatesSchema[];
    isTemplate: boolean;
};
