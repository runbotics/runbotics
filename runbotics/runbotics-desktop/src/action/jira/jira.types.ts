import z from 'zod';
import {
    getEpicWorklogInputBaseSchema,
    getEpicWorklogInputSchema,
    getProjectWorklogInputBaseSchema,
    getProjectWorklogInputSchema,
    getUserWorklogInputBaseSchema,
    getUserWorklogInputSchema,
    getJiraInputBaseSchema,
    jiraDatesCollectionSchema,
    jiraSingleDaySchema,
    jiraDatesPeriodSchema,
    getBoardSprintsInputSchema,
    getSprintTasksInputSchema,
    getTaskDetailsInputSchema
} from './jira.utils';
import { CloudJiraUser, SimpleCloudJiraUser } from './jira-cloud/jira-cloud.types';
import { ServerJiraUser, SimpleServerJiraUser } from './jira-server/jira-server.types';
import { Dayjs } from 'dayjs';
import { JiraSprintState } from 'runbotics-common';

export type GetJiraInputBase = z.infer<typeof getJiraInputBaseSchema>
export type GetUserWorklogBase = z.infer<typeof getUserWorklogInputBaseSchema>
export type GetEpicWorklogBase = z.infer<typeof getEpicWorklogInputBaseSchema>
export type GetProjectWorklogBase = z.infer<typeof getProjectWorklogInputBaseSchema>
export type JiraSingleDay = GetJiraInputBase & z.infer<typeof jiraSingleDaySchema>
export type JiraDatesPeriod = GetJiraInputBase & z.infer<typeof jiraDatesPeriodSchema>
export type JiraDatesCollection = GetJiraInputBase & z.infer<typeof jiraDatesCollectionSchema>
export type GetWorklogInput = GetUserWorklogInput & GetProjectWorklogInput & GetEpicWorklogInput;
export type GetJiraDatesInput = JiraSingleDay | JiraDatesPeriod | JiraDatesCollection;
export type GetUserWorklogInput = z.infer<typeof getUserWorklogInputSchema>;
export type GetEpicWorklogInput = z.infer<typeof getEpicWorklogInputSchema>;
export type GetProjectWorklogInput = z.infer<typeof getProjectWorklogInputSchema>;
export type GetBoardSprintsInput = z.infer<typeof getBoardSprintsInputSchema>;
export type GetSprintTasksInput = z.infer<typeof getSprintTasksInputSchema>;
export type GetTaskDetailsInput = z.infer<typeof getTaskDetailsInputSchema>;

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

export enum BoardType {
    SCRUM = 'scrum',
    KANBAN = 'kanban',
    SIMPLE = 'simple',
}

export interface Board {
    id: number;
    self: string;
    name: string;
    type: BoardType;
    location: {
        projectId: number;
        displayName: string;
        projectName: string;
        projectKey: string;
        projectTypeKey: string;
        avatarURI: string;
        name: string;
    }
}

export interface Sprint {
    id: number;
    self: string;
    state: JiraSprintState;
    name: string;
    startDate: string;
    endDate: string;
    completeDate: string;
    originBoardId: number;
}

export interface SprintResponse extends Page {
    isLast: boolean;
    values: Sprint[];
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
    dates?: Dayjs[],
}

export interface WorklogIsCreatorParams<T extends CloudJiraUser | ServerJiraUser> {
    worklog: Worklog<T>;
    jiraUser: T,
}

export enum IssueWorklogsParam {
    EPIC = 'epic',
    PROJECT = 'project',
    WORKLOG_AUTHOR = 'worklogAuthor',
}

interface GetIssueWorklogsByParamCommon {
    param: IssueWorklogsParam;
}
interface GetIssueWorklogsByAuthorParam extends GetIssueWorklogsByParamCommon {
    param: IssueWorklogsParam.WORKLOG_AUTHOR;
    author: string;
}

interface GetIssueWorklogsByEpicParam extends GetIssueWorklogsByParamCommon {
    param: IssueWorklogsParam.EPIC;
    epic: string;
}
interface GetIssueWorklogsByProjectParam extends GetIssueWorklogsByParamCommon {
    param: IssueWorklogsParam.PROJECT;
    project: string;
}
export type GetIssueWorklogsByParam = GetIssueWorklogsByAuthorParam | GetIssueWorklogsByProjectParam | GetIssueWorklogsByEpicParam;
export type AtlassianCredentials = Required<Pick<GetWorklogInput, 'username' | 'password' | 'originUrl'>>;
