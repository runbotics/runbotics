
import { IBpmnAction } from '../../../../../Actions/types';
import { TemplatesSchema } from '../templates/Template.types';

export enum ListPanelTab {
    ACTIONS = 'ACTIONS',
    TEMPLATES = 'TEMPLATES'
}

export interface ActionListPanelProps {
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
