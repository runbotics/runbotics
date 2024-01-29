import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { JiraCloudAction } from 'runbotics-common';
import { GetWorklogInput } from '../jira.types';

export type JiraActionRequest =
    | DesktopRunRequest<JiraCloudAction.GET_USER_WORKLOGS, GetWorklogInput>;

export interface CloudJiraUser {
    accountId: string;
    accountType: string;
    active: boolean;
    avatarUrls: any;
    displayName: string;
    self: string;
    timeZone: string;
    emailAddress: string;
}

export interface SimpleCloudJiraUser {
    accountId: CloudJiraUser['accountId'];
    emailAddress?: CloudJiraUser['emailAddress'];
}
