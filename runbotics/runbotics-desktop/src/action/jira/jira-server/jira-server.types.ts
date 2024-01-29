import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { JiraServerAction } from 'runbotics-common';
import { GetWorklogInput } from '../jira.types';

export type JiraActionRequest =
    | DesktopRunRequest<JiraServerAction.GET_USER_WORKLOGS, GetWorklogInput>;


export interface ServerJiraUser {
    active: boolean;
    avatarUrls: any;
    displayName: string;
    self: string;
    timeZone: string;
    emailAddress: string;
    key: string;
    name: string;
    deleted: boolean;
    locale: string;
}

export interface SimpleServerJiraUser {
    key: ServerJiraUser['key'];
    name: ServerJiraUser['name'];
    emailAddress?: ServerJiraUser['emailAddress'];
}
