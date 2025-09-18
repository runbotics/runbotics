import { Test } from '@nestjs/testing';
import JiraServerActionHandler from './jira-server.action-handler';
import { SearchIssue, WorklogResponse, GetUserWorklogInput } from '../jira.types';
import { ServerJiraUser } from './jira-server.types';
import * as jiraUtils from './jira-server.utils';
import { ServerConfigService } from '#config';

describe('JiraServerActionHandler', () => {
    let jiraServerActionHandler: JiraServerActionHandler;
    let serverConfigService: ServerConfigService;

    const getWorklogInputDate: GetUserWorklogInput = {
        email: 'john.doe@runbotics.com',
        originUrl: 'https://JIRA_CLOUD_URL',
        password: 'JIRA_CLOUD_PASSWORD',
        username: 'JIRA_CLOUD_USERNAME',
        mode: 'date',
        date: '2023-11-12',
    };
    const getWorklogInputPeriod: GetUserWorklogInput = {
        email: 'john.doe@runbotics.com',
        originUrl: 'https://JIRA_CLOUD_URL',
        password: 'JIRA_CLOUD_PASSWORD',
        username: 'JIRA_CLOUD_USERNAME',
        mode: 'period',
        startDate: '2023-11-12',
        endDate: '2023-11-14'
    };
    const getWorklogInputCollection: GetUserWorklogInput = {
        email: 'john.doe@runbotics.com',
        originUrl: 'https://JIRA_CLOUD_URL',
        password: 'JIRA_CLOUD_PASSWORD',
        username: 'JIRA_CLOUD_USERNAME',
        mode: 'collection',
        dates: ['2023-11-12', '2023-11-15'],
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JiraServerActionHandler,
                {
                    provide: ServerConfigService,
                    useValue: {
                        jiraUsername: () => 'username',
                        jiraUrl: () => 'https://some-url.com',
                        jiraPassword: () => 'passwd',
                        jiraA41Username: () => 'a41username',
                        jiraA41Token: () => 'token',
                        jiraA41Url: () => 'https://some-url.com',
                    }
                }
            ],
        }).compile();
        jiraServerActionHandler = module.get(JiraServerActionHandler);
        serverConfigService = module.get<ServerConfigService>(ServerConfigService);
    });

    it('should be defined', () => {
        expect(jiraServerActionHandler).toBeDefined();
    });

    describe('GetWorklog', () => {
        const jiraUser: ServerJiraUser = {
            key: 'john-doe-identifier',
            name: 'john-doe',
            deleted: false,
            locale: 'en_US',
            active: true,
            avatarUrls: null,
            displayName: 'John Doe',
            emailAddress: 'john.doe@runbotics.com',
            self: 'madeUpUrl',
            timeZone: 'Warsaw',
        };
        const issuetype: SearchIssue<ServerJiraUser>['fields']['issuetype'] = {
            id: '1',
            name: 'test',
            self: 'madeUpUrl',
            avatarId: 1,
            description: '',
            hierarchyLevel: 1,
            iconUrl: '',
            subtask: false,
        };
        const project: SearchIssue<ServerJiraUser>['fields']['project'] = {
            id: '',
            key: '',
            name: '',
            self: '',
            projectCategory: {
                id: '',
                description: '',
                name: '',
                self: '',
            },
            avatarUrls: {},
            projectTypeKey: '',
            simplified: true,
        };
        const jiraIssue: SearchIssue<ServerJiraUser> = {
            expand: 'someFields',
            self: 'madeUpUrl',
            fields: {
                summary: 'name of the jira ticket',
                issuetype,
                labels: [],
                parent: {
                    id: '',
                    fields: {
                        issuetype,
                        project,
                        labels: [],
                        summary: '',
                        worklog: {
                            worklogs: [],
                            maxResults: 20,
                            startAt: 0,
                            total: 4,
                        },
                        status: {},
                    },
                    key: '',
                    self: '',
                },
                project,
                status: {},
                worklog: {
                    worklogs: [
                        { // valid jiraUser worklog
                            id: '12345',
                            author: jiraUser,
                            created: '2023-11-13T10:00:00.000+0100',
                            issueId: '654321',
                            started: '2023-11-13T10:00:00.000+0100',
                            self: 'madeUpUrl',
                            timeSpent: '4h',
                            timeSpentSeconds: 4 * 60 * 60,
                            updateAuthor: jiraUser,
                            updated: '2023-11-13T10:00:00.000+0100',
                            comment: '',
                        }, { // valid jiraUser worklog
                            id: '23456',
                            author: jiraUser,
                            created: '2023-11-12T10:00:00.000+0100',
                            issueId: '654321',
                            started: '2023-11-12T10:00:00.000+0100',
                            self: 'madeUpUrl',
                            timeSpent: '4h',
                            timeSpentSeconds: 4 * 60 * 60,
                            updateAuthor: jiraUser,
                            updated: '2023-11-12T10:00:00.000+0100',
                            comment: '',
                        }, { // jiraUser worklog from different time period
                            id: '34567',
                            author: jiraUser,
                            created: '2023-11-15T10:00:00.000+0100',
                            issueId: '654321',
                            started: '2023-11-15T10:00:00.000+0100',
                            self: 'madeUpUrl',
                            timeSpent: '4h',
                            timeSpentSeconds: 4 * 60 * 60,
                            updateAuthor: jiraUser,
                            updated: '2023-11-15T10:00:00.000+0100',
                            comment: '',
                        }, { // worklog of a different user
                            id: '45678',
                            author: {
                                ...jiraUser,
                                key: 'bruce-wayne-identifier',
                                displayName: 'Bruce Wayne',
                                name: 'bruce-wayne'
                            },
                            created: '2023-11-13T10:00:00.000+0100',
                            issueId: '654321',
                            started: '2023-11-13T10:00:00.000+0100',
                            self: 'madeUpUrl',
                            timeSpent: '4h',
                            timeSpentSeconds: 4 * 60 * 60,
                            updateAuthor: jiraUser,
                            updated: '2023-11-13T10:00:00.000+0100',
                            comment: ''
                        }
                    ],
                    maxResults: 20,
                    startAt: 0,
                    total: 4
                },
            },
            id: '654321',
            key: 'RPA-1',
        };
        const emptyUserIssuesWorklogs: SearchIssue<ServerJiraUser>[] = [];
        const userIssuesWorklogs: SearchIssue<ServerJiraUser>[] = [jiraIssue];
        const partialUserIssuesWorklogs: SearchIssue<ServerJiraUser>[] = [{
            ...jiraIssue, fields: {
                ...jiraIssue.fields, worklog: {
                    ...jiraIssue.fields.worklog,
                    total: 34,
                }
            }
        }];

        beforeEach(() => {
            vi.spyOn(jiraUtils, 'getJiraUser').mockResolvedValue(jiraUser);
        });

        it('should return empty worklog list', async () => {
            vi.spyOn(jiraUtils, 'getIssueWorklogsByParam').mockResolvedValue(emptyUserIssuesWorklogs);


            await expect(() => jiraServerActionHandler.getWorklog(getWorklogInputDate))
                .toHaveLength(0);
        });

        it('should return list with single worklog', async () => {
            vi.spyOn(jiraUtils, 'getIssueWorklogsByParam').mockResolvedValue(userIssuesWorklogs);


            const worklogs = await jiraServerActionHandler.getWorklog(getWorklogInputDate);
            expect(worklogs).toHaveLength(1);
            expect(worklogs[0].timeSpentHours).toBe(4);
        });

        it('should return single worklog map', async () => {
            vi.spyOn(jiraUtils, 'getIssueWorklogsByParam').mockResolvedValue(userIssuesWorklogs);


            const worklogs = await jiraServerActionHandler.getWorklog({ ...getWorklogInputDate, groupByDay: true });
            expectTypeOf(worklogs).toBeObject();
            expectTypeOf(Object.keys(worklogs)[0]).toBeString();
            expectTypeOf(Object.values(worklogs)[0]).toBeArray();
            expect(worklogs['2023-11-12'][0].timeSpentHours).toBe(4);
        });

        it('should return worklog list', async () => {
            vi.spyOn(jiraUtils, 'getIssueWorklogsByParam').mockResolvedValue(userIssuesWorklogs);


            const worklogs = await jiraServerActionHandler.getWorklog(getWorklogInputPeriod);
            expect(worklogs).toHaveLength(2);
            expect(worklogs[0].timeSpentHours).toBe(4);
            expect(worklogs[1].timeSpentHours).toBe(4);
        });

        it('should call getIssueWorklogs', async () => {
            vi.spyOn(jiraUtils, 'getIssueWorklogsByParam').mockResolvedValue(partialUserIssuesWorklogs);
            const getIssueWorklogsSpy = vi.spyOn(jiraUtils, 'getIssueWorklogs').mockResolvedValue({
                worklogs: userIssuesWorklogs[0].fields.worklog.worklogs,
                maxResults: userIssuesWorklogs[0].fields.worklog.maxResults,
                total: userIssuesWorklogs[0].fields.worklog.total,
                startAt: userIssuesWorklogs[0].fields.worklog.startAt,
            } satisfies WorklogResponse<ServerJiraUser>);

            await jiraServerActionHandler.getWorklog(getWorklogInputDate);
            expect(getIssueWorklogsSpy).toHaveBeenCalledOnce();
        });

        it('should return worklog list based on collection', async () => {
            vi.spyOn(jiraUtils, 'getIssueWorklogsByParam').mockResolvedValue(userIssuesWorklogs);

            const worklogs = await jiraServerActionHandler.getWorklog(getWorklogInputCollection);
            expect(worklogs).toHaveLength(2);
        });

        it('should throw wrong date property', async () => {
            await expect(() => jiraServerActionHandler.getWorklog({
                ...getWorklogInputDate, date: ''
            })).rejects.toThrowError();
        });

        it('should throw wrong datePeriod properties', async () => {
            await expect(() => jiraServerActionHandler.getWorklog({
                ...getWorklogInputPeriod, startDate: '',
            })).rejects.toThrowError();
            await expect(() => jiraServerActionHandler.getWorklog({
                ...getWorklogInputPeriod, startDate: undefined,
            })).rejects.toThrowError();
            await expect(() => jiraServerActionHandler.getWorklog({
                ...getWorklogInputPeriod, endDate: '',
            })).rejects.toThrowError();
            await expect(() => jiraServerActionHandler.getWorklog({
                ...getWorklogInputPeriod, endDate: undefined,
            })).rejects.toThrowError();
            await expect(() => jiraServerActionHandler.getWorklog({
                ...getWorklogInputPeriod, startDate: '', endDate: '',
            })).rejects.toThrowError();
        });
    });
});
