import z from 'zod';
import { getWorklogInputBaseSchema, getWorklogInputSchema, worklogDaySchema, worklogPeriodSchema } from './jira.utils';

export type GetWorklogBase = z.infer<typeof getWorklogInputBaseSchema>
export type WorklogDay = z.infer<typeof worklogDaySchema>
export type WorklogPeriod = z.infer<typeof worklogPeriodSchema>
export type GetWorklogInput = z.infer<typeof getWorklogInputSchema>

export interface Page {
    maxResults: number;
    startAt: number;
    total: number;
}

export interface Worklog<User extends object> {
    author: Omit<User, 'emailAddress'>;
    comment: string;
    created: string;
    id: string;
    issueId: string;
    self: string;
    started: string;
    timeSpent: string;
    timeSpentSeconds: number;
    updateAuthor: Omit<User, 'emailAddress'>;
    updated: string;
}

export interface Project {
    avatarUrls: unknown;
    id: string;
    key: string;
    name: string;
    projectCategory: {
        description: string;
        id: string;
        name: string;
        self: string;
    };
    projectTypeKey: string;
    self: string;
    simplified: boolean;
}

export interface IssueType {
    avatarId: number;
    description: string;
    hierarchyLevel: number;
    iconUrl: string;
    id: string;
    name: string;
    self: string;
    subtask: boolean;
}

export interface Status {
    description: string;
    iconUrl: string;
    id: string;
    name: string;
    self: string;
    statusCategory: {
        colorName: string;
        id: number;
        key: string;
        name: string;
        self: string;
    };
}

export interface WorklogResponse<User extends object> extends Page {
    worklogs: Worklog<User>[];
}

export interface SearchIssue<User extends object> {
    expand: string,
    fields: {
        summary: string;
        worklog: Page & {
            worklogs: Worklog<User>[];
        };
        issuetype: IssueType;
        parent?: Omit<SearchIssue<User>, 'expand'>;
        project: Project;
        labels: string[];
        status: any;
    },
    id: string,
    key: string,
    self: string,
}

export interface SimpleIssue {
    id: string;
    key: string;
    summary: string;
    self: string;
    type: Partial<IssueType>;
}

export interface IssueWorklogResponse<User extends object> extends Page {
    expand: 'schema,names',
    issues: SearchIssue<User>[],
}
