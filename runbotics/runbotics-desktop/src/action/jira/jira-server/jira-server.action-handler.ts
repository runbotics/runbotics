import { ZodError } from 'zod';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { Injectable } from '@nestjs/common';
import { JiraServerAction } from 'runbotics-common';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { RunboticsLogger } from '#logger';

import {
    AVAILABLE_FORMATS,
    getDatesCollectionBoundaries,
    getIssueWorklogs,
    getIssueWorklogsByParam,
    getJiraUser,
    getUserWorklogInputSchema,
    groupByDay,
    isAllowedDate,
    isJiraDatesCollection,
    isWorklogCreator,
    isJiraSingleDay,
    isJiraDatesPeriod,
    sortAscending
} from '../jira.utils';
import { AtlassianCredentials, GetUserWorklogInput, IssueWorklogsParam, SearchIssue, SimpleWorklog, Worklog, WorklogOutput } from '../jira.types';
import { JiraActionRequest, ServerJiraUser, SimpleServerJiraUser } from './jira-server.types';
import { formatZodError } from '#utils/zodError';
import { ServerConfigService } from '#config';

/**
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2
 */
@Injectable()
export default class JiraCloudActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(JiraCloudActionHandler.name);

    constructor(private readonly serverConfigService: ServerConfigService) {
        super();
    }

    async getWorklog(rawInput: GetUserWorklogInput) {
        let startDate, endDate, datesCollectionObjects;

        const input = await getUserWorklogInputSchema.parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        if (isJiraSingleDay(input)) {
            startDate = dayjs(input.date, AVAILABLE_FORMATS).startOf('day');
            endDate = dayjs(input.date, AVAILABLE_FORMATS).endOf('day');
            this.logger.log(`Gathering worklogs for single date: ${input.date}`);
        }
        if (isJiraDatesPeriod(input)) {
            startDate = dayjs(input.startDate, AVAILABLE_FORMATS).startOf('day');
            endDate = dayjs(input.endDate, AVAILABLE_FORMATS).endOf('day');
            this.logger.log(`Gathering worklogs for date period: ${input.startDate} - ${input.endDate}`);
        }
        if (isJiraDatesCollection(input)) {
            const { min, max, datesObjects } = getDatesCollectionBoundaries(input.dates);
            startDate = min.startOf('day');
            endDate = max.endOf('day');
            datesCollectionObjects = datesObjects;
            this.logger.log(`Gathering worklogs for dates collection: ${input.dates.join(',')}`);
        }

        const jiraUser = await getJiraUser<ServerJiraUser>({ input, isServer: true });
        const issues = await getIssueWorklogsByParam<ServerJiraUser>(
            { param: IssueWorklogsParam.WORKLOG_AUTHOR, author: jiraUser.name },
            input,
        );
        this.logger.log(`Found ${issues.length} issues containing desired worklogs`);

        const worklogs = (await Promise.all(issues
            .flatMap(async (issue) => {
                const worklogResponse = issue.fields.worklog;
                const isEveryWorklogPresent = worklogResponse.total <= worklogResponse.maxResults;
                const { worklogs } = isEveryWorklogPresent
                    ? worklogResponse
                    : await (() => {
                        this.logger.log(`Fetching all worklogs for issue ${issue.key}`);
                        return getIssueWorklogs<ServerJiraUser>(issue.key, input);
                    })();
                return worklogs
                    .filter(worklog =>
                        isWorklogCreator<ServerJiraUser>({
                            worklog,
                            jiraUser,
                        }) &&
                        isAllowedDate<ServerJiraUser>({
                            worklog,
                            startDate,
                            endDate,
                            dates: datesCollectionObjects,
                        }))
                    .map(worklog => this.mapWorklogOutput(worklog, issue));
            })
        )).flatMap(w => w);

        return input.groupByDay
            ? groupByDay(worklogs)
            : sortAscending(worklogs);
    }

    private getSimpleWorklog({
        updateAuthor, issueId, ...worklog
    }: Worklog<ServerJiraUser>): SimpleWorklog<ServerJiraUser> {
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

    private mapWorklogOutput(
        worklog: Worklog<ServerJiraUser>, issue: SearchIssue<ServerJiraUser>
    ): WorklogOutput<ServerJiraUser> {
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

    run(request: JiraActionRequest) {
        // @todo method for matching credentialId (action template) with decrypted credential values
        const atlassianCredentials: AtlassianCredentials = {
            originUrl: this.serverConfigService.jiraUrl,
            username: this.serverConfigService.jiraUsername,
            password: this.serverConfigService.jiraPassword,
        };

        const inputWithAuth = {
            ...request.input,
            ...atlassianCredentials,
        };

        switch (request.script) {
            case JiraServerAction.GET_USER_WORKLOGS:
                return this.getWorklog(inputWithAuth);
            default:
                throw new Error('Action not found');
        }
    }
}
