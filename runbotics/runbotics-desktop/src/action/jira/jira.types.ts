import z from 'zod';
import { getWorklogInputBaseSchema, getWorklogInputSchema, worklogCollectionSchema, worklogDaySchema, worklogPeriodSchema } from './jira.utils';
import { CloudJiraUser, SimpleCloudJiraUser } from './jira-cloud/jira-cloud.types';
import { ServerJiraUser, SimpleServerJiraUser } from './jira-server/jira-server.types';
import { Dayjs } from 'dayjs';

export type GetWorklogBase = z.infer<typeof getWorklogInputBaseSchema>
export type WorklogDay = GetWorklogBase & z.infer<typeof worklogDaySchema>
export type WorklogPeriod = GetWorklogBase & z.infer<typeof worklogPeriodSchema>
export type WorklogCollection = GetWorklogBase & z.infer<typeof worklogCollectionSchema>
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

export type SimpleWorklog<T extends CloudJiraUser | ServerJiraUser> = T extends CloudJiraUser
    ? Omit<Worklog<T>, 'author' | 'updateAuthor' | 'issueId'> & {
        author: SimpleCloudJiraUser;
        timeSpentHours: number;
    }
    : Omit<Worklog<T>, 'author' | 'updateAuthor' | 'issueId'> & {
        author: SimpleServerJiraUser;
        timeSpentHours: number;
    };

export type WorklogOutput<T extends CloudJiraUser | ServerJiraUser> = SimpleWorklog<T> & {
    issue: SimpleIssue;
    parent: SimpleIssue;
    project: Partial<Project>;
    labels: string[];
    status: Partial<Status>;
}

export interface WorklogAllowedDateParams<T extends CloudJiraUser | ServerJiraUser> {
    worklog: Worklog<T>;
    startDate: Dayjs,
    endDate: Dayjs,
    jiraUser: T,
    dates?: Dayjs[],
}
