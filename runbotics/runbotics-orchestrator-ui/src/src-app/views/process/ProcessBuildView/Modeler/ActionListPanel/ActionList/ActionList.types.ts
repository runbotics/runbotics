import { Filters, GroupProperties } from '../ActionListPanel.types';
import { Item } from '../ListGroup';
import { GroupAction, GroupState } from '../useGroupsReducer';

export const ADVANCED_ACTION_GROUP_IDS = [
    'sap',
    'beeoffice',
    'jira',
    'asana',
    'mail',
    'loop',
    'google',
    'desktopOfficeActions',
    'sharepointExcel',
    'sharepointFile',
    'application',
];

export const ADVANCED_ACTION_IDS = [
    'variables.assignGlobalVariable',
    'general.startProcess',
    'general.delay',
];

export interface ActionListProps {
    groups: GroupProperties[];
    openGroupsState: GroupState;
    dispatchGroups: React.Dispatch<GroupAction>;
    handleItemClick: (event: React.MouseEvent<HTMLElement>, item: Item) => void;
    filters: Filters;
}
