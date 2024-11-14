import { ZodError } from 'zod';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { Injectable } from '@nestjs/common';
import { JiraCloudAction } from 'runbotics-common';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { RunboticsLogger } from '#logger';

import {
    JiraActionRequest,
    CloudJiraUser,
    SimpleCloudJiraUser,
    FilteredUserWorklogsParams,
    FilteredProjectWorklogsParams
} from './jira-cloud.types';
import {
    AVAILABLE_FORMATS,
    getDatesCollectionBoundaries,
    getIssueWorklogs,
    getIssueWorklogsByParam,
    getJiraProject,
    getJiraUser,
    getProjectWorklogInputSchema,
    getUserWorklogInputSchema,
    groupByDay,
    isAllowedDate,
    isJiraDatesCollection,
    isWorklogCreator,
    isJiraSingleDay,
    isJiraDatesPeriod,
    sortAscending,
    getBoardSprintsInputSchema,
    getSprintTasksInputSchema,
    getJiraAllBoardSprints,
    getJiraAllSprintTasks
} from '../jira.utils';
import {
    GetJiraDatesInput,
    GetBoardSprintsInput,
    GetProjectWorklogInput,
    GetSprintTasksInput,
    GetUserWorklogInput,
    GetWorklogInput,
    IssueWorklogsParam,
    SearchIssue,
    SimpleWorklog,
    Worklog,
    WorklogOutput,
    AtlassianCredentials,
} from '../jira.types';
import { formatZodError } from '#utils/zodError';
import { ServerConfigService } from '#config';
import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';

/**
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2
 */
@Injectable()
export default class JiraCloudActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(JiraCloudActionHandler.name);

    constructor(private readonly serverConfigService: ServerConfigService) {
        super();
    }

    async getUserWorklog(rawInput: GetUserWorklogInput) {
        const input = await getUserWorklogInputSchema.parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const { startDate, endDate, dates } = this.getJiraDates(input);

        const jiraUser = await getJiraUser<CloudJiraUser>({ input });
        const issues = await getIssueWorklogsByParam<CloudJiraUser>(
            { param: IssueWorklogsParam.WORKLOG_AUTHOR, author: jiraUser.accountId },
            input,
        );
        this.logger.log(`Found ${issues.length} issues containing desired worklogs`);

        const worklogs = await this.getAllWorklogsForIssue(
            input,
            issues,
            this.filterUserWorklogs({
                startDate,
                endDate,
                dates,
                jiraUser
            })
        );

        return input.groupByDay
            ? groupByDay(worklogs)
            : sortAscending(worklogs);
    }

    async getProjectWorklog(rawInput: GetProjectWorklogInput) {
        const input = await getProjectWorklogInputSchema.parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const { startDate, endDate, dates } = this.getJiraDates(input);

        const jiraProject = await getJiraProject(input);
        const issues = await getIssueWorklogsByParam<CloudJiraUser>(
            { param: IssueWorklogsParam.PROJECT, project: jiraProject.key },
            input,
        );
        this.logger.log(`Found ${issues.length} issues containing desired worklogs`);

        const worklogs = await this.getAllWorklogsForIssue(
            input,
            issues,
            this.filterProjectWorklogs({
                startDate,
                endDate,
                dates,
            })
        );

        return input.groupByDay
            ? groupByDay(worklogs)
            : sortAscending(worklogs);
    }

    async getBoardSprints(rawInput: GetBoardSprintsInput) {
        const input = await getBoardSprintsInputSchema.parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const sprints = await getJiraAllBoardSprints(input.boardId, input);

        return sprints;
    }

    async getSprintTasks(rawInput: GetSprintTasksInput) {
        const input = await getSprintTasksInputSchema.parseAsync(rawInput)
            .catch((error: ZodError) => {
                throw formatZodError(error);
            });

        const sprintTasks = await getJiraAllSprintTasks(input);

        return sprintTasks;
    }

    private getJiraDates(input: GetJiraDatesInput) {
        let startDate: Dayjs, endDate: Dayjs, dates: Dayjs[];

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
            dates = datesObjects;
            this.logger.log(`Gathering worklogs for dates collection: ${input.dates.join(',')}`);
        }

        return {
            startDate,
            endDate,
            dates,
        };
    }

    private async getAllWorklogsForIssue(
        input: GetWorklogInput,
        issues: SearchIssue<CloudJiraUser>[],
        filterWorklogCb: (worklog: Worklog<CloudJiraUser>) => boolean,
    ) {
        const worklogs = (await Promise.all(issues
            .flatMap(async (issue) => {
                const worklogResponse = issue.fields.worklog;
                const isEveryWorklogPresent = worklogResponse.total <= worklogResponse.maxResults;
                const { worklogs } = isEveryWorklogPresent
                    ? worklogResponse
                    : await (() => {
                        this.logger.log(`Fetching all worklogs for issue ${issue.key}`);
                        return getIssueWorklogs<CloudJiraUser>(issue.key, input);
                    })();
                return worklogs
                    .filter(filterWorklogCb)
                    .map(worklog => this.mapWorklogOutput(worklog, issue));
            })
        )).flatMap(w => w);

        return worklogs;
    }

    private filterUserWorklogs({ startDate, endDate, dates, jiraUser }: FilteredUserWorklogsParams) {
        return (worklog: Worklog<CloudJiraUser>) => {
            return isWorklogCreator<CloudJiraUser>({
                worklog,
                jiraUser,
            }) &&
            isAllowedDate<CloudJiraUser>({
                worklog,
                startDate,
                endDate,
                dates,
            });
        };
    }

    private filterProjectWorklogs({ startDate, endDate, dates }: FilteredProjectWorklogsParams) {
        return (worklog: Worklog<CloudJiraUser>) => {
            return isAllowedDate<CloudJiraUser>({
                worklog,
                startDate,
                endDate,
                dates,
            });
        };
    }

    private getSimpleWorklog({
        updateAuthor, issueId, ...worklog
    }: Worklog<CloudJiraUser>): SimpleWorklog<CloudJiraUser> {
        return {
            ...worklog,
            timeSpentHours: worklog.timeSpentSeconds * 1.0 / 60 / 60,
            author: this.getSimpleAuthor(worklog.author),
        };
    }

    private getSimpleAuthor(author: CloudJiraUser | Worklog<CloudJiraUser>['author']): SimpleCloudJiraUser {
        return {
            accountId: author.accountId,
            ...('emailAddress' in author && { emailAddress: author.emailAddress }),
        };
    }

    private mapWorklogOutput(
        worklog: Worklog<CloudJiraUser>, issue: SearchIssue<CloudJiraUser>
    ): WorklogOutput<CloudJiraUser> {
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
        const matchedCredential =
            credentialAttributesMapper<AtlassianCredentials>(request.credentials);

        // @todo After completion of password manager switch fully to matchedCredential
        const atlassianCredentials: AtlassianCredentials = matchedCredential ?? {
            originUrl: this.serverConfigService.jiraA41Url,
            username: this.serverConfigService.jiraA41Username,
            password: this.serverConfigService.jiraA41Token,
        };

        const inputWithAuth = {
            ...request.input,
            ...atlassianCredentials,
        };

        switch (request.script) {
            case JiraCloudAction.GET_USER_WORKLOGS:
                return this.getUserWorklog(inputWithAuth);
            case JiraCloudAction.GET_PROJECT_WORKLOGS:
                return this.getProjectWorklog(inputWithAuth);
            case JiraCloudAction.GET_BOARD_SPRINTS:
                return this.getBoardSprints(inputWithAuth);
            case JiraCloudAction.GET_SPRINT_TASKS:
                return this.getSprintTasks(inputWithAuth);
            default:
                throw new Error('Action not found');
        }
    }
}
