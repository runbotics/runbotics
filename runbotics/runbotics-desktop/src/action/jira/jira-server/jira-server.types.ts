import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { JiraServerAction } from 'runbotics-common';
import { GetWorklogInput, Page } from '../jira.types';

export type JiraActionRequest =
    | DesktopRunRequest<JiraServerAction.GET_USER_WORKLOGS, GetWorklogInput>;


export interface JiraUser {
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

export interface SimpleJiraUser {
    key: JiraUser['key'];
    name: JiraUser['name'];
    emailAddress?: JiraUser['emailAddress'];
}

export type Worklog = {
    author: Omit<JiraUser, 'emailAddress'>;
    comment: string;
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

export interface SimpleWorklog extends Omit<Worklog, 'author' | 'updateAuthor' | 'issueId' | 'comment'> {
    timeSpentHours: number;
    author: SimpleJiraUser;
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
