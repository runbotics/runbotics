import { ACTIONS_GROUPS, ApiAction, BrowserAction, GeneralAction, VariableAction } from 'runbotics-common';

import { Filters, GroupProperties } from '../ActionListPanel.types';
import { Item } from '../ListGroup';
import { GroupAction, GroupState } from '../useGroupsReducer';

export const ADVANCED_ACTION_GROUP_IDS = [
    ACTIONS_GROUPS.SAP,
    ACTIONS_GROUPS.BEEOFFICE,
    ACTIONS_GROUPS.JIRA,
    ACTIONS_GROUPS.ASANA,
    ACTIONS_GROUPS.MAIL,
    ACTIONS_GROUPS.LOOP,
    ACTIONS_GROUPS.GOOGLE,
    ACTIONS_GROUPS.DESKTOP_OFFICE_ACTIONS,
    ACTIONS_GROUPS.SHAREPOINT_EXCEL,
    ACTIONS_GROUPS.SHAREPOINT_FILE,
    ACTIONS_GROUPS.APPLICATION,
];

export const ADVANCED_ACTION_IDS = [
    VariableAction.ASSIGN_GLOBAL,
    GeneralAction.START_PROCESS,
    GeneralAction.DELAY,
    BrowserAction.SELENIUM_TAKE_SCREENSHOT,
    BrowserAction.SELENIUM_PRINT_TO_PDF,
    ApiAction.DOWNLOAD_FILE
];

export interface ActionListProps {
    groups: GroupProperties[];
    openGroupsState: GroupState;
    dispatchGroups: React.Dispatch<GroupAction>;
    handleItemClick: (event: React.MouseEvent<HTMLElement>, item: Item) => void;
    filters: Filters;
}
