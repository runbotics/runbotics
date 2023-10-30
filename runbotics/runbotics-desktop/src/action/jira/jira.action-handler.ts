import { StatelessActionHandler, DesktopRunRequest, DesktopRunResponse } from '@runbotics/runbotics-sdk';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { externalAxios, ServerConfigService } from '#config';
import { RunboticsLogger } from '#logger';

export type JIRAActionRequest =
| DesktopRunRequest<'jira.getLoggedWorkForUser', JIRAGetLoggedWorkActionInput>;

export type JIRAGetLoggedWorkActionInput = {
    isAll41JIRA: boolean;
    email: string;
    date?: string;
};
export type JIRAGetLoggedWorkActionOutput = any[];

type Issue = {
    id: string;
    key: string;
    fields: Record<string, any>;
};

type Worklog = {
    author: {
        key: string;
        name: string | undefined;
        accountId: string | undefined;
    };
    comment: string;
    created: string;
    id: string;
    issueId: string;
    self: string;
    started: string;
    timeSpent: string;
    timeSpentSeconds: number;
    issue: Issue;
    updateAuthor: {
        displayName: string;
        emailAddress: string;
        key: string;
        name: string;
    };
    updated: string;
};

type WorklogList = {
    worklogs: Worklog[];
};

type IssueList = {
    issues: Issue[];
};

type JiraUser = {
    active: boolean;
    avatarUrls: any;
    deleted: boolean;
    displayName: string;
    emailAddress: string;
    key: string;
    locale: string;
    name: string | undefined;
    accountId: string | undefined;
    self: string;
    timeZone: string;
};

@Injectable()
export default class JiraActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(JiraActionHandler.name);

    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    async getLoggedWork(input: JIRAGetLoggedWorkActionInput): Promise<JIRAGetLoggedWorkActionOutput> {
        const result = {};
        let loggedWorklogs = [];

        if (!input.date) throw new Error('Date is required, empty date not supported yet');
        try {
            const basicAuth = input.isAll41JIRA
                ? 'Basic ' +
                Buffer.from(this.serverConfigService.jiraA41Username + ':' + this.serverConfigService.jiraA41Token).toString('base64')
                : 'Basic ' +
                Buffer.from(this.serverConfigService.jiraUsername + ':' + this.serverConfigService.jiraPassword).toString('base64');

            const responseUsers = await externalAxios.get<JiraUser[]>(
                input.isAll41JIRA
                    ? this.serverConfigService.jiraA41Url + `/rest/api/3/user/search?query=${input.email}`
                    : this.serverConfigService.jiraUrl + `/rest/api/2/user/search?maxResults=10&startAt=0&username=${input.email}`,
                {
                    headers: {
                        Authorization: basicAuth,
                    },
                    maxRedirects: 0,
                },
            );
            const users = responseUsers.data;
            if (users.length == 0) {
                //throw new Error('User not found');
                this.logger.error('User not found.');
                return [];
            }
            const found = input.isAll41JIRA
                ? users[0]
                : users.find((user) => user.name.toLocaleLowerCase().includes('ext'));

            const today = moment(input.date);
            const tomorrow = moment(today);
            tomorrow.add(1, 'days');

            const yesterday = moment(today);
            yesterday.subtract(1, 'days');
            const author = input.isAll41JIRA ? found.accountId : found.name;

            const param = `/rest/api/2/search?jql=worklogAuthor%20in%20(%22${author}%22)%20and%20worklogDate%20%3E%3D%20%27${yesterday.format(
                'YYYY-MM-DD',
            )}%27%20and%20worklogDate%20%3C%20%27${tomorrow.format(
                'YYYY-MM-DD',
            )}%27&fields=summary%2Cworklog%2Cissuetype%2Cparent%2Cproject%2Cstatus%2Ctimeoriginalestimate%2Ctimeestimate&maxResults=1000`;

            const response = await externalAxios.get<IssueList>(
                input.isAll41JIRA ? this.serverConfigService.jiraA41Url + param : this.serverConfigService.jiraUrl + param,
                {
                    headers: {
                        Authorization: basicAuth,
                    },
                    maxRedirects: 0,
                },
            );

            for (const issue of response.data.issues) {
                const issueDetailsResponse = await externalAxios.get<Issue>(
                    input.isAll41JIRA
                        ? this.serverConfigService.jiraA41Url + `/rest/api/2/issue/${issue.key}`
                        : this.serverConfigService.jiraUrl + `/rest/api/2/issue/${issue.key}`,
                    {
                        headers: {
                            Authorization: basicAuth,
                        },
                        maxRedirects: 0,
                    },
                );

                const taskWorklogListResponse = await externalAxios.get<WorklogList>(
                    input.isAll41JIRA
                        ? this.serverConfigService.jiraA41Url + `/rest/api/2/issue/${issue.key}/worklog`
                        : this.serverConfigService.jiraUrl + `/rest/api/2/issue/${issue.key}/worklog`,
                    {
                        headers: {
                            Authorization: basicAuth,
                        },
                        maxRedirects: 0,
                    },
                );

                const taskWorklogList = taskWorklogListResponse.data;
                this.logger.log('taskWorklogList', taskWorklogList);
                const userTaskWorklogs = taskWorklogList.worklogs.filter(
                    (worklog) =>
                        (input.isAll41JIRA ? worklog.author.accountId : worklog.author.name) === author &&
                        moment(worklog.started).isSame(today, 'day'),
                );
                userTaskWorklogs.forEach((userTaskWorklog) => {
                    userTaskWorklog.issue = issueDetailsResponse.data;
                });
                loggedWorklogs = loggedWorklogs.concat(userTaskWorklogs);
            }

            this.logger.log('response', response);
            this.logger.log('loggedWorklogs', loggedWorklogs);
        } catch (e) {
            this.logger.error('Error', e);
            throw e;
        }
        return loggedWorklogs;
    }

    run(request: JIRAActionRequest) {
        switch (request.script) {
            case 'jira.getLoggedWorkForUser':
                return this.getLoggedWork(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
