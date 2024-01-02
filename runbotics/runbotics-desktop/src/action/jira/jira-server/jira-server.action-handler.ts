import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { Injectable } from '@nestjs/common';
import { JiraServerAction } from 'runbotics-common';
import _ from 'lodash';
import dayjs from 'dayjs';
import type { ZodError } from 'zod';

import { externalAxios } from '#config';
import { RunboticsLogger } from '#logger';

import {
    JiraActionRequest, SimpleWorklog,
    ServerJiraUser, SimpleServerJiraUser, WorklogOutput
} from './jira-server.types';
import { AVAILABLE_FORMATS, getWorklogInputSchema, isWorklogDay, isWorklogPeriod } from '../jira.utils';
import { GetWorklogBase, GetWorklogInput, IssueWorklogResponse, SearchIssue, Worklog, WorklogResponse } from '../jira.types';

/**
 * @see https://docs.atlassian.com/software/jira/docs/api/REST/9.11.0
 */
@Injectable()
export default class JiraServerActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(JiraServerActionHandler.name);

    constructor() {
        super();
    }

    async getWorklog(rawInput: GetWorklogInput) {
        let startDate, endDate;

        const input = await getWorklogInputSchema.parseAsync(rawInput)
            .catch((error: ZodError) => {
                const fieldErrors = error.formErrors.fieldErrors;
                if (Object.keys(fieldErrors).length > 0) {
                    throw new Error(Object.values(fieldErrors)[0][0]);
                } else {
                    throw new Error(error.issues[0].message);
                }
            });

        if (isWorklogDay(input)) {
            startDate = dayjs(input.date, AVAILABLE_FORMATS).startOf('day');
            endDate = dayjs(input.date, AVAILABLE_FORMATS).endOf('day');
        }
        if (isWorklogPeriod(input)) {
            startDate = dayjs(input.startDate, AVAILABLE_FORMATS).startOf('day');
            endDate = dayjs(input.endDate, AVAILABLE_FORMATS).endOf('day');
        }

        const jiraUser = await this.getJiraUser(input);
        const { issues } = await this.getUserIssueWorklogs(jiraUser.name, input);

        const worklogs = (await Promise.all(issues
            .flatMap(async (issue) => {
                const worklogResponse = issue.fields.worklog;
                const isEveryWorklogPresent = worklogResponse.total <= worklogResponse.maxResults;
                const { worklogs } = isEveryWorklogPresent
                    ? worklogResponse
                    : (await this.getIssueWorklogs(issue.key, input));
                return worklogs
                    .filter(worklog => worklog.author.key === jiraUser.key
                        && dayjs(worklog.started).isAfter(startDate)
                        && dayjs(worklog.started).isBefore(endDate))
                    .map(worklog => this.mapWorklogOutput(worklog, issue));
            })
        )).flatMap(w => w);

        return input.groupByDay
            ? this.groupByDay(worklogs)
            : this.sortAscending(worklogs);
    }

    private sortAscending(worklogs: WorklogOutput[]) {
        return worklogs.sort((a, b) => dayjs(a.started).isBefore(dayjs(b.started)) ? -1 : 1);
    }

    private groupByDay(worklogs: WorklogOutput[]) {
        const worklogsByDay = _.groupBy(worklogs, (worklog) => dayjs(worklog.started).format('DD-MM-YYYY'));

        return worklogsByDay;
    }

    private getSimpleWorklog({ updateAuthor, issueId, comment, ...worklog }: Worklog<ServerJiraUser>): SimpleWorklog {
        return {
            ...worklog,
            timeSpentHours: worklog.timeSpentSeconds * 1.0 / 60 / 60,
            author: this.getSimpleAuthor(worklog.author),
        };
    }

    private getSimpleAuthor(author: ServerJiraUser | Worklog<ServerJiraUser>['author']): SimpleServerJiraUser {
        return {
            key: author.key,
            name: author.name,
            ...('emailAddress' in author && { emailAddress: author.emailAddress.toLowerCase() }),
        };
    }

    private mapWorklogOutput(worklog: Worklog<ServerJiraUser>, issue: SearchIssue<ServerJiraUser>): WorklogOutput {
        const { issuetype, parent, project, status, worklog: innerWorklog, ...issueDetails } = issue.fields;
        return {
            ...this.getSimpleWorklog(worklog),
            issue: {
                ...issueDetails,
                id: issue.id,
                key: issue.key,
                summary: issue.fields.summary,
                self: issue.self,
                type: {
                    id: issue.fields.issuetype.id,
                    description: issue.fields.issuetype.description,
                    self: issue.fields.issuetype.self,
                    name: issue.fields.issuetype.name,
                    subtask: issue.fields.issuetype.subtask,
                }
            },
            parent: issue.fields.parent ? {
                id: issue.fields.parent.id,
                key: issue.fields.parent.key,
                self: issue.fields.parent.self,
                summary: issue.fields.parent.fields.summary,
                type: {
                    id: issue.fields.parent.fields.issuetype.id,
                    description: issue.fields.parent.fields.issuetype.description,
                    self: issue.fields.parent.fields.issuetype.self,
                    name: issue.fields.parent.fields.issuetype.name,
                    subtask: issue.fields.parent.fields.issuetype.subtask,
                }
            } : null,
            project: {
                id: issue.fields.project.id,
                key: issue.fields.project.key,
                name: issue.fields.project.name,
                self: issue.fields.project.self,
            },
            labels: issue.fields.labels,
            status: {
                id: issue.fields.status.id,
                name: issue.fields.status.name,
                self: issue.fields.status.self,
            },
        };
    }

    private getIssueWorklogs(issueKey: string, input: GetWorklogInput) {
        let timeParam: { startedBefore: number; startedAfter: number };
        if (isWorklogDay(input)) {
            timeParam = {
                startedBefore: dayjs(input.date, AVAILABLE_FORMATS).endOf('day').valueOf(),
                startedAfter: dayjs(input.date, AVAILABLE_FORMATS).startOf('day').valueOf(),
            };
        } else if (isWorklogPeriod(input)) {
            timeParam = {
                startedBefore: dayjs(input.endDate, AVAILABLE_FORMATS).endOf('day').valueOf(),
                startedAfter: dayjs(input.startDate, AVAILABLE_FORMATS).startOf('day').valueOf(),
            };
        }

        return externalAxios.get<WorklogResponse<ServerJiraUser>>(
            `${process.env[input.originEnv]}/rest/api/2/issue/${issueKey}/worklog`,
            {
                headers: this.getBasicAuthHeader(input),
                params: {
                    ...timeParam,
                    maxResults: 1000,
                },
                maxRedirects: 0,
            },
        )
            .then(response => response.data);
    }

    private getUserIssueWorklogs(author: string, input: GetWorklogInput) {
        let dateCondition = '';
        if (isWorklogDay(input)) {
            const date = dayjs(input.date, AVAILABLE_FORMATS).format('YYYY-MM-DD');
            dateCondition = `worklogDate=${date}`;
        } else if (isWorklogPeriod(input)) {
            const start = dayjs(input.startDate, AVAILABLE_FORMATS).format('YYYY-MM-DD');
            const end = dayjs(input.endDate, AVAILABLE_FORMATS).format('YYYY-MM-DD');
            dateCondition = `worklogDate>=${start} AND worklogDate<=${end}`;
        }

        return externalAxios.get<IssueWorklogResponse<ServerJiraUser>>(
            `${process.env[input.originEnv]}/rest/api/2/search`,
            {
                headers: this.getBasicAuthHeader(input),
                params: {
                    jql: `${dateCondition} AND worklogAuthor=${author}`,
                    fields: '*all,-watches,-votes,-timetracking,-reporter,-progress,-issuerestriction,-issuelinks,-fixVersions,-comment,-attachment,-aggregateprogress,-assignee,-creator,-description,-duedate,-environment,-lastViewed,-resolution,-resolutiondate,-security,-statuscategorychangedate,-subtasks,-versions,-workratio,-timespent,-timeoriginalestimate,-timeestimate,-aggregatetimespent,-aggregatetimeoriginalestimate,-aggregatetimeestimate',
                },
                maxRedirects: 0,
            },
        )
            .then(response => response.data);
    }

    /**
     * @throws when the specified user is not found
     */
    private async getJiraUser(input: GetWorklogBase) {
        const { data } = await externalAxios.get<ServerJiraUser[]>(
            `${process.env[input.originEnv]}/rest/api/2/user/search`,
            {
                params: {
                    maxResults: 10,
                    startAt: 0,
                    username: input.email,
                },
                headers: this.getBasicAuthHeader(input),
                maxRedirects: 0,
            },
        );

        if (data.length === 0) {
            throw new Error(`User ${input.email} not found`);
        }

        return data[0];
    }

    private getBasicAuthHeader(data: Pick<GetWorklogBase, 'passwordEnv' | 'usernameEnv'>) {
        return {
            Authorization: 'Basic ' + Buffer.from(
                `${process.env[data.usernameEnv]}:${process.env[data.passwordEnv]}`
            ).toString('base64')
        };
    }

    run(request: JiraActionRequest) {
        switch (request.script) {
            case JiraServerAction.GET_USER_WORKLOGS:
                return this.getWorklog(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
