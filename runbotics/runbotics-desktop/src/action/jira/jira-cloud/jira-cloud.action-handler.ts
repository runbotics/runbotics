import { ZodError } from 'zod';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { Injectable } from '@nestjs/common';
import { JiraCloudAction } from 'runbotics-common';
import _ from 'lodash';
import dayjs from 'dayjs';

import { externalAxios } from '#config';
import { RunboticsLogger } from '#logger';

import {
    JiraActionRequest, Worklog, SimpleWorklog,
    JiraUser, IssueWorklogResponse, SimpleJiraUser,
    WorklogResponse, WorklogOutput
} from './jira-cloud.types';
import { getWorklogInputSchema, isWorklogDay, isWorklogPeriod } from '../jira.utils';
import { GetWorklogBase, GetWorklogInput } from '../jira.types';

/**
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2
 */
@Injectable()
export default class JiraCloudActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(JiraCloudActionHandler.name);

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
            startDate = dayjs(input.date).startOf('day');
            endDate = dayjs(input.date).endOf('day');
        }
        if (isWorklogPeriod(input)) {
            startDate = dayjs(input.startDate).startOf('day');
            endDate = dayjs(input.endDate).endOf('day');
        }

        const jiraUser = await this.getJiraUser(input);
        const { issues } = await this.getUserIssueWorklogs(jiraUser.accountId, input);

        const worklogs = (await Promise.all(issues
            .flatMap(async (issue) => {
                const worklogResponse = issue.fields.worklog;
                const isEveryWorklogPresent = worklogResponse.total <= worklogResponse.maxResults;
                const { worklogs } = isEveryWorklogPresent
                    ? worklogResponse
                    : (await this.getIssueWorklogs(issue.key, input));
                return worklogs
                    .filter(worklog => worklog.author.accountId === jiraUser.accountId
                        && dayjs(worklog.started).isAfter(startDate)
                        && dayjs(worklog.started).isBefore(endDate))
                    .map<WorklogOutput>(worklog => ({
                        ...this.getSimpleWorklog(worklog),
                        issue: {
                            id: issue.id,
                            key: issue.key,
                            summary: issue.fields.summary,
                            self: issue.self,
                        },
                    }));
            })
        )).flatMap(w => w);

        return this.groupByDay(worklogs);
    }

    private groupByDay(worklogs: WorklogOutput[]) {
        const worklogsByDay = _.groupBy(worklogs, (worklog) => dayjs(worklog.started).format('DD-MM-YYYY'));

        return Object.values(worklogsByDay);
    }

    private getSimpleWorklog({ updateAuthor, issueId, ...worklog }: Worklog): SimpleWorklog {
        return {
            ...worklog,
            timeSpentHours: worklog.timeSpentSeconds * 1.0 / 60 / 60,
            author: this.getSimpleAuthor(worklog.author),
        };
    }

    private getSimpleAuthor(author: JiraUser | Worklog['author']): SimpleJiraUser {
        return {
            accountId: author.accountId,
            ...('emailAddress' in author && { emailAddress: author.emailAddress }),
        };
    }

    private getIssueWorklogs(issueKey: string, input: GetWorklogInput) {
        let timeParam: { startedBefore: number; startedAfter: number };
        if (isWorklogDay(input)) {
            timeParam = {
                startedBefore: dayjs(input.date).endOf('day').valueOf(),
                startedAfter: dayjs(input.date).startOf('day').valueOf(),
            };
        } else if (isWorklogPeriod(input)) {
            timeParam = {
                startedBefore: dayjs(input.endDate).endOf('day').valueOf(),
                startedAfter: dayjs(input.startDate).startOf('day').valueOf(),
            };
        }

        return externalAxios.get<WorklogResponse>(
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
            const date = dayjs(input.date).format('YYYY-MM-DD');
            dateCondition = `worklogDate=${date}`;
        } else if (isWorklogPeriod(input)) {
            const start = dayjs(input.startDate).format('YYYY-MM-DD');
            const end = dayjs(input.endDate).format('YYYY-MM-DD');
            dateCondition = `worklogDate>=${start} AND worklogDate<=${end}`;
        }

        return externalAxios.get<IssueWorklogResponse>(
            `${process.env[input.originEnv]}/rest/api/2/search`,
            {
                headers: this.getBasicAuthHeader(input),
                params: {
                    jql: `${dateCondition} AND worklogAuthor=${author}`,
                    fields: 'worklog,summary',
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
        const { data } = await externalAxios.get<JiraUser[]>(
            `${process.env[input.originEnv]}/rest/api/2/user/search`,
            {
                params: {
                    maxResults: 10,
                    startAt: 0,
                    query: input.email,
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
            case JiraCloudAction.GET_USER_WORKLOGS:
                return this.getWorklog(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}