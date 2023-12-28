import { Test } from '@nestjs/testing';
import JiraCloudActionHandler from './jira-cloud.action-handler';
import { GetWorklogInput } from '../jira.types';
import { IssueWorklogResponse, CloudJiraUser, SearchIssue, WorklogResponse } from './jira-cloud.types';
import { ZodError } from 'zod';

describe('JiraCloudActionHandler', () => {
    let jiraCloudActionHandler: JiraCloudActionHandler;

    const getWorklogInputDate: GetWorklogInput = {
        email: 'john.doe@runbotics.com',
        originEnv: 'JIRA_CLOUD_URL',
        passwordEnv: 'JIRA_CLOUD_PASSWORD',
        usernameEnv: 'JIRA_CLOUD_USERNAME',
        date: '2023-11-12',
    };
    const getWorklogInputPeriod: GetWorklogInput = {
        email: 'john.doe@runbotics.com',
        originEnv: 'JIRA_CLOUD_URL',
        passwordEnv: 'JIRA_CLOUD_PASSWORD',
        usernameEnv: 'JIRA_CLOUD_USERNAME',
        startDate: '2023-11-12',
        endDate: '2023-11-14'
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JiraCloudActionHandler,
            ],
        }).compile();
        jiraCloudActionHandler = module.get(JiraCloudActionHandler);
    });

    it('should be defined', () => {
        expect(jiraCloudActionHandler).toBeDefined();
    });

    describe('GetWorklog', () => {
        const jiraUser: CloudJiraUser = {
            accountId: 'john-doe-identifier',
            accountType: '',
            active: true,
            avatarUrls: null,
            displayName: 'John Doe',
            emailAddress: 'john.doe@runbotics.com',
            self: 'madeUpUrl',
            timeZone: 'Warsaw',
        };
        const jiraIssue: SearchIssue = {
            expand: 'someFields',
            self: 'madeUpUrl',
            fields: {
                summary: 'name of the jira ticket',
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
                            updated: '2023-11-13T10:00:00.000+0100'
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
                            updated: '2023-11-12T10:00:00.000+0100'
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
                            updated: '2023-11-15T10:00:00.000+0100'
                        }, { // worklog of a different user
                            id: '45678',
                            author: {
                                ...jiraUser,
                                accountId: 'bruce-wayne-identifier',
                                displayName: 'Bruce Wayne',
                                emailAddress: 'bruce.wayne@runbotics.com',
                            },
                            created: '2023-11-13T10:00:00.000+0100',
                            issueId: '654321',
                            started: '2023-11-13T10:00:00.000+0100',
                            self: 'madeUpUrl',
                            timeSpent: '4h',
                            timeSpentSeconds: 4 * 60 * 60,
                            updateAuthor: jiraUser,
                            updated: '2023-11-13T10:00:00.000+0100'
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
        const emptyUserIssuesWorklogs: IssueWorklogResponse = {
            expand: 'schema,names',
            issues: [],
            maxResults: 100,
            startAt: 0,
            total: 0,
        };
        const partialUserIssuesWorklogs: IssueWorklogResponse = {
            expand: 'schema,names',
            issues: [{
                ...jiraIssue, fields: {
                    ...jiraIssue.fields, worklog: {
                        ...jiraIssue.fields.worklog,
                        total: 34,
                    }
                }
            }],
            maxResults: 100,
            startAt: 0,
            total: 1,
        };
        const userIssuesWorklogs: IssueWorklogResponse = {
            expand: 'schema,names',
            issues: [jiraIssue],
            maxResults: 100,
            startAt: 0,
            total: 1,
        };

        beforeEach(() => {
            vi.spyOn(JiraCloudActionHandler.prototype as any, 'getJiraUser')
                .mockResolvedValue(jiraUser);
            vi.spyOn(JiraCloudActionHandler.prototype as any, 'getBasicAuthHeader')
                .mockReturnValue('basic auth string');
        });

        it('should return empty worklog list', async () => {
            vi.spyOn(JiraCloudActionHandler.prototype as any, 'getUserIssueWorklogs')
                .mockResolvedValue(emptyUserIssuesWorklogs);

            await expect(() => jiraCloudActionHandler.getWorklog(getWorklogInputDate))
                .toHaveLength(0);
        });

        it('should return single worklog', async () => {
            vi.spyOn(JiraCloudActionHandler.prototype as any, 'getUserIssueWorklogs')
                .mockResolvedValue(userIssuesWorklogs);

            const worklogs = await jiraCloudActionHandler.getWorklog(getWorklogInputDate);
            expect(worklogs).toHaveLength(1);
            expect(worklogs[0]).toHaveLength(1);
            expect(worklogs[0][0].timeSpentHours).toBe(4);
        });

        it('should return worklog list', async () => {
            vi.spyOn(JiraCloudActionHandler.prototype as any, 'getUserIssueWorklogs')
                .mockResolvedValue(userIssuesWorklogs);

            const worklogs = await jiraCloudActionHandler.getWorklog(getWorklogInputPeriod);
            expect(worklogs).toHaveLength(2);
            expect(worklogs[0]).toHaveLength(1);
            expect(worklogs[1]).toHaveLength(1);
            expect(worklogs[0][0].timeSpentHours).toBe(4);
            expect(worklogs[1][0].timeSpentHours).toBe(4);
        });

        it('should call getIssueWorklogs', async () => {
            vi.spyOn(JiraCloudActionHandler.prototype as any, 'getUserIssueWorklogs')
                .mockResolvedValue(partialUserIssuesWorklogs);
            const getIssueWorklogsSpy = vi.spyOn(JiraCloudActionHandler.prototype as any, 'getIssueWorklogs')
                .mockResolvedValue({
                    worklogs: userIssuesWorklogs.issues[0].fields.worklog.worklogs,
                    maxResults: userIssuesWorklogs.issues[0].fields.worklog.maxResults,
                    total: userIssuesWorklogs.issues[0].fields.worklog.total,
                    startAt: userIssuesWorklogs.issues[0].fields.worklog.startAt,
                } satisfies WorklogResponse);

            await jiraCloudActionHandler.getWorklog(getWorklogInputDate);
            expect(getIssueWorklogsSpy).toHaveBeenCalledOnce();
        });

        it('should throw wrong date property', async () => {
            await expect(() => jiraCloudActionHandler.getWorklog({
                ...getWorklogInputDate, date: ''
            })).rejects.toThrowError();
        });

        it('should throw wrong datePeriod properties', async () => {
            await expect(() => jiraCloudActionHandler.getWorklog({
                ...getWorklogInputPeriod, startDate: '',
            })).rejects.toThrowError();
            await expect(() => jiraCloudActionHandler.getWorklog({
                ...getWorklogInputPeriod, startDate: undefined,
            })).rejects.toThrowError();
            await expect(() => jiraCloudActionHandler.getWorklog({
                ...getWorklogInputPeriod, endDate: '',
            })).rejects.toThrowError();
            await expect(() => jiraCloudActionHandler.getWorklog({
                ...getWorklogInputPeriod, endDate: undefined,
            })).rejects.toThrowError();
            await expect(() => jiraCloudActionHandler.getWorklog({
                ...getWorklogInputPeriod, startDate: '', endDate: '',
            })).rejects.toThrowError();
        });
    });
});
