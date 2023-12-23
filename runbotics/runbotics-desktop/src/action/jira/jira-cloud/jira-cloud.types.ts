import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { JiraCloudAction } from 'runbotics-common';
import { GetWorklogInput, Page } from '../jira.types';

export type JiraActionRequest =
    | DesktopRunRequest<JiraCloudAction.GET_WORKLOG, GetWorklogInput>;


export interface JiraUser {
    accountId: string;
    accountType: string;
    active: boolean;
    avatarUrls: any;
    displayName: string;
    self: string;
    timeZone: string;
    emailAddress: string;
}

export interface SimpleJiraUser {
    accountId: JiraUser['accountId'];
    emailAddress?: JiraUser['emailAddress'];
}

export type Worklog = {
    author: Omit<JiraUser, 'emailAddress'>;
    created: string;
    id: string;
    issueId: string;
    self: string;
    started: string;
    timeSpent: string;
    timeSpentSeconds: number;
    updateAuthor: Omit<JiraUser, 'emailAddress'>;
    updated: string;
};

export interface SimpleWorklog extends Omit<Worklog, 'author' | 'updateAuthor' | 'issueId'> {
    author: SimpleJiraUser;
    timeSpentHours: number;
}

export interface WorklogResponse extends Page {
    worklogs: Worklog[];
}

export interface IssueWorklogResponse extends Page {
    expand: 'schema,names',
    issues: SimpleIssue[],
}

export interface SimpleIssue {
    expand: string,
    fields: {
        summary: string,
        worklog: Page & {
            worklogs: Worklog[],
        },
    },
    id: string,
    key: string,
    self: string,
}

export interface WorklogOutput extends SimpleWorklog {
    issue: {
        id: string;
        key: string;
        summary: string;
        self: string;
    }
}
