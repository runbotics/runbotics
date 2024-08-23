import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { JiraCloudAction } from 'runbotics-common';
import { GetProjectSprintsInput, GetProjectWorklogInput, GetSprintTasksInput, GetUserWorklogInput, WorklogAllowedDateParams, WorklogIsCreatorParams } from '../jira.types';

export type JiraActionRequest =
    | DesktopRunRequest<JiraCloudAction.GET_USER_WORKLOGS, GetUserWorklogInput>
    | DesktopRunRequest<JiraCloudAction.GET_PROJECT_WORKLOGS, GetProjectWorklogInput>
    | DesktopRunRequest<JiraCloudAction.GET_PROJECT_SPRINTS, GetProjectSprintsInput>
    | DesktopRunRequest<JiraCloudAction.GET_SPRINT_TASKS, GetSprintTasksInput>;

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

export type FilteredUserWorklogsParams = Partial<Omit<WorklogAllowedDateParams<CloudJiraUser> &
    WorklogIsCreatorParams<CloudJiraUser>, 'worklog'>>;

export type FilteredProjectWorklogsParams = Partial<Omit<WorklogAllowedDateParams<CloudJiraUser>, 'worklog'>>;
