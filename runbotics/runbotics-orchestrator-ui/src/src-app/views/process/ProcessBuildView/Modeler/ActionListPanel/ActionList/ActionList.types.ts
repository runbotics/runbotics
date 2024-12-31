import {
    ACTION_GROUP,
    ApiAction,
    BrowserAction,
    GeneralAction,
    VariableAction,
    AllActionIds
} from 'runbotics-common';

import { Filters, GroupProperties } from '../ActionListPanel.types';
import { Item } from '../ListGroup';
import { GroupAction, GroupState } from '../useGroupsReducer';

export const ADVANCED_ACTION_GROUP_IDS: ACTION_GROUP[] = [
    ACTION_GROUP.SAP,
    ACTION_GROUP.BEEOFFICE,
    ACTION_GROUP.JIRA,
    ACTION_GROUP.JIRA_CLOUD,
    ACTION_GROUP.JIRA_SERVER,
    ACTION_GROUP.ASANA,
    ACTION_GROUP.MAIL,
    ACTION_GROUP.LOOP,
    ACTION_GROUP.GOOGLE,
    ACTION_GROUP.DESKTOP_OFFICE_ACTIONS,
    ACTION_GROUP.CLOUD_EXCEL,
    ACTION_GROUP.CLOUD_FILE,
    ACTION_GROUP.APPLICATION,
    ACTION_GROUP.CSV,
    ACTION_GROUP.FILE,
    ACTION_GROUP.DESKTOP,
    ACTION_GROUP.EXCEL,
    ACTION_GROUP.POWER_POINT,
    ACTION_GROUP.WINDOWS,
    ACTION_GROUP.VISUAL_BASIC,
    ACTION_GROUP.EXTERNAL,
];

export const ADVANCED_ACTION_IDS: AllActionIds[] = [
    VariableAction.ASSIGN_GLOBAL,
    GeneralAction.START_PROCESS,
    GeneralAction.DELAY,
    BrowserAction.SELENIUM_TAKE_SCREENSHOT,
    ApiAction.DOWNLOAD_FILE,
];

export interface ActionListProps {
    groups: GroupProperties[];
    openGroupsState: GroupState;
    dispatchGroups: React.Dispatch<GroupAction>;
    handleItemClick: (event: React.MouseEvent<HTMLElement>, item: Item) => void;
    filters: Filters;
}

