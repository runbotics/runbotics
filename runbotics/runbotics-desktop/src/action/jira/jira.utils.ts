import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import {
    GetJiraInputBase,
    GetWorklogInput,
    IssueWorklogResponse,
    JiraDatesCollection,
    JiraSingleDay,
    WorklogOutput,
    JiraDatesPeriod,
    WorklogResponse,
    WorklogAllowedDateParams,
    SearchIssue,
    WorklogIsCreatorParams,
    GetUserWorklogInput,
    GetProjectWorklogInput,
    GetIssueWorklogsByParam,
    Project,
    GetBoardSprintsInput,
    SprintResponse,
    Sprint,
    Page,
    GetSprintTasksInput,
    GetTaskDetailsInput,
    AtlassianCredentials
} from './jira.types';
import { CloudJiraUser } from './jira-cloud/jira-cloud.types';
import { ServerJiraUser } from './jira-server/jira-server.types';
import { externalAxios } from '#config';
import _ from 'lodash';
import z from 'zod';
import { JiraSprintState, JiraTaskStatus } from 'runbotics-common';

export const isJiraInputBase = (
    data: unknown
): data is GetJiraInputBase => data
&& typeof data === 'object'
&& 'originUrl' in data && typeof data.originUrl === 'string'
&& 'username' in data && typeof data.username === 'string'
&& 'password' in data && typeof data.password === 'string';

export const isJiraDatesPeriod = (
    data: unknown
): data is JiraDatesPeriod => isJiraInputBase(data)
&& 'startDate' in data && typeof data.startDate === 'string'
&& 'endDate' in data && typeof data.endDate === 'string';

export const isJiraSingleDay = (
    data: unknown
): data is JiraSingleDay => isJiraInputBase(data)
&& 'date' in data && typeof data.date === 'string';

export const isJiraDatesCollection = (
    data: unknown
): data is JiraDatesCollection => isJiraInputBase(data)
&& 'dates' in data && Array.isArray(data.dates) && typeof data.dates[0] === 'string';

export const isCloudJiraUser = (
    data: unknown
): data is CloudJiraUser => data
&& typeof data === 'object'
&& 'accountId' in data && typeof data.accountId === 'string';

export const isServerJiraUser = (
    data: unknown
): data is ServerJiraUser => data
&& typeof data === 'object'
&& 'key' in data && typeof data.key === 'string';

const dateValidator = (property: string) => z.string({
    required_error: `${property} property is missing`
})
    .refine(
        date => dayjs(date, AVAILABLE_FORMATS, true).isValid(),
        date => ({ message: `${property}: "${date}" is not a valid date. Expected [${AVAILABLE_FORMATS.join(', ')}]` }),
    );

export const AVAILABLE_FORMATS = [
    'D.M.YYYY', 'DD.MM.YYYY', 'D-M-YYYY', 'DD-MM-YYYY', 'D/M/YYYY', 'DD/MM/YYYY',
    'YYYY.M.D', 'YYYY.MM.DD', 'YYYY-M-D', 'YYYY-MM-DD', 'YYYY/M/D', 'YYYY/MM/DD'].flatMap(date => [date, `${date} HH:mm`]);

export const getJiraInputBaseSchema = z.object({
    originUrl: z.string().refine(value => value.startsWith('https://'), { message: 'originUrl must start with "https://"' }),
    username: z.string(),
    password: z.string(),
});

export const getUserWorklogInputBaseSchema = getJiraInputBaseSchema.and(z.object({
    email: z.string({ required_error: 'Email property is missing' }).email(),
    groupByDay: z.boolean().optional(),
}));

export const getEpicWorklogInputBaseSchema = getJiraInputBaseSchema.and(z.object({
    epic: z.string({ required_error: 'Epic ID is missing' }),
    groupByDay: z.boolean().optional(),
}));

export const getProjectWorklogInputBaseSchema = getJiraInputBaseSchema.and(z.object({
    project: z.string({ required_error: 'Project key is missing' }),
    groupByDay: z.boolean().optional(),
}));

export const jiraSingleDaySchema = z.object({
    mode: z.literal('date').optional(),
    date: dateValidator('Date').optional(),
});

export const jiraDatesPeriodSchema = z.object({
    mode: z.literal('period').optional(),
    startDate: dateValidator('Start Date').optional(),
    endDate: dateValidator('End Date').optional(),
});

export const jiraDatesCollectionSchema = z.object({
    mode: z.literal('collection').optional(),
    dates: z.array(dateValidator('Dates')).optional(),
});

export const getUserWorklogInputSchema = getUserWorklogInputBaseSchema.and(z.union([
    jiraSingleDaySchema.required({ date: true }),
    jiraDatesPeriodSchema.required({ startDate: true, endDate: true }),
    jiraDatesCollectionSchema.required({ dates: true }),
]));

export const getEpicWorklogInputSchema = getEpicWorklogInputBaseSchema.and(z.union([
    jiraSingleDaySchema.required({ date: true }),
    jiraDatesPeriodSchema.required({ startDate: true, endDate: true }),
    jiraDatesCollectionSchema.required({ dates: true }),
]));

export const getProjectWorklogInputSchema = getProjectWorklogInputBaseSchema.and(z.union([
    jiraSingleDaySchema.required({ date: true }),
    jiraDatesPeriodSchema.required({ startDate: true, endDate: true }),
    jiraDatesCollectionSchema.required({ dates: true }),
]));

export const getBoardSprintsInputSchema = getJiraInputBaseSchema.and(z.object({
    boardId: z.string({ required_error: 'Board ID is missing' }),
    state: z.nativeEnum(JiraSprintState).optional(),
}));

export const getSprintTasksInputBaseSchema = getJiraInputBaseSchema.and(z.object({
    sprint: z.string({ required_error: 'Sprint name is missing' }),
    email: z.string().email().optional(),
    status: z.nativeEnum(JiraTaskStatus).optional(),
    fields: z.string().optional(),
}));

export const getSprintTasksInputSchema = getSprintTasksInputBaseSchema.and(z.union([
    jiraSingleDaySchema,
    jiraDatesPeriodSchema,
    jiraDatesCollectionSchema,
]));

export const getTaskDetailsInputSchema = getJiraInputBaseSchema.and(z.object({
    task: z.string({ required_error: 'Task ID is missing' }),
    fields: z.string().optional(),
}));

export const getBasicAuthHeader = ({ username, password }: Omit<AtlassianCredentials, 'originUrl'>) => {
    return {
        Authorization: 'Basic ' + Buffer.from(
            `${username}:${password}`
        ).toString('base64')
    };
};

interface GetJiraUserParams {
    input: GetUserWorklogInput;
    isServer?: boolean;
}

/**
 * @throws when the specified user is not found
 */
export const getJiraUser = async <T extends CloudJiraUser | ServerJiraUser>({
    input, isServer,
}: GetJiraUserParams) => {
    const { originUrl, username, password, email } = input;
    const { data } = await externalAxios.get<T[]>(
        `${originUrl}/rest/api/3/user/search`,
        {
            params: {
                maxResults: 10,
                startAt: 0,
                query: email,
            },
            headers: getBasicAuthHeader({ password, username }),
            maxRedirects: 0,
        },
    );

    if (data.length === 0) {
        throw new Error(`User ${email} not found`);
    }

    const jiraUser = data[0];
    return jiraUser;
};

export const getJiraProject = async ({ password, username, originUrl, project }: GetProjectWorklogInput)=> {
    const { data } = await externalAxios.get<Project>(
        `${originUrl}/rest/api/3/project/${project}`,
        {
            headers: getBasicAuthHeader({ password, username }),
            maxRedirects: 0,
        },
    );

    if (!data) {
        throw new Error(`Project ${project} not found`);
    }

    const projectData = data;
    return projectData;
};

export const getJiraAllSprintTasks = async <T extends CloudJiraUser>(
    input: GetSprintTasksInput,
) => {
    let dateCondition = '';
    if (isJiraSingleDay(input)) {
        const date = input.date;
        dateCondition = `AND statusCategoryChangedDate="${date}"`;
    } else if (isJiraDatesPeriod(input)) {
        const start = input.startDate;
        const end = input.endDate;
        dateCondition = `AND statusCategoryChangedDate>="${start}" AND statusCategoryChangedDate<="${end}"`;
    } else if (isJiraDatesCollection(input)) {
        const mappedDates = input.dates
            .map(date => `"${date}"`)
            .join(',');
        dateCondition = `AND statusCategoryChangedDate in (${mappedDates})`;
    }
    const assignee = input?.email ? `AND assignee="${input.email}"` : '';
    const status = input?.status ? `AND statusCategory="${input.status}"` : '';
    const jql = `sprint="${input.sprint}" ${assignee} ${status} ${dateCondition}`.trim();

    let startAt = 0;
    const issues: SearchIssue<T>[] = [];

    const response = await getJiraSprintTasksPage<T>(input, jql, startAt);

    startAt = response.maxResults;
    issues.push(...response.issues);

    while (response.total > startAt) {
        const response = await getJiraSprintTasksPage<T>(input, jql, startAt);
        issues.push(...response.issues);
        startAt = response.startAt + response.maxResults;
    }

    return {
        total: response.total,
        issues,
    };
};

export const getJiraAllTaskDetails = async <T extends CloudJiraUser>(
    input: GetTaskDetailsInput,
) => {
    const jql = `key="${input.task}"`.trim();

    const START_AT = 0;
    return await searchTaskDetails<T>(input, jql, START_AT)
        .then(res => res.total > 0 ? res.issues[0] : null)
};

const searchTaskDetails = async <T extends CloudJiraUser>(
    input: GetSprintTasksInput,
    jql: string,
    startAt: Page['startAt'],
)  => {
    const { username, password, originUrl } = input;
    const BASE_FIELDS = ['summary', 'issue_type', 'created', 'resolutiondate', 'updated', 'status', 'assignee', 'issuelinks', 'priority', 'reporter', 'components', 'labels', 'sprint', 'epic link', 'timespent', 'duedate', 'customfield_10020', 'customfield_10014'].join(',');
    const additionalFields = input?.fields
        ? input?.fields
            .split(',')
            .map(field => field.trim())
            .filter(field => !BASE_FIELDS.split(',').includes(field))
            .join(',')
        : '';

    const fields = additionalFields
        ? `${BASE_FIELDS},${additionalFields}`
        : BASE_FIELDS;

    const MAX_SEARCH_RESULTS = 100;
    const { data } =  await externalAxios.get<IssueWorklogResponse<T>>(
        `${originUrl}/rest/api/3/search/jql`,
        {
            params: {
                jql,
                maxResults: MAX_SEARCH_RESULTS,
                startAt,
                fields,
            },
            headers: getBasicAuthHeader({ username, password }),
            maxRedirects: 0,
        },
    );

    return data;
};

const getJiraSprintTasksPage = async <T extends CloudJiraUser>(
    input: GetSprintTasksInput,
    jql: string,
    startAt: Page['startAt'],
) => {
    const { username, password, originUrl } = input;
    const baseFields = 'timespent,duedate,statuscategorychangedate,status';
    const additionalFields = input?.fields
        ? input?.fields
            .split(',')
            .map(field => field.trim())
            .filter(field => !baseFields.split(',').includes(field))
            .join(',')
        : '';

    const fields = additionalFields
        ? `${baseFields},${additionalFields}`
        : baseFields;

    const { data } =  await externalAxios.get<IssueWorklogResponse<T>>(
        `${originUrl}/rest/api/3/search/jql`,
        {
            params: {
                jql,
                maxResults: 100, // 100 is max value
                startAt,
                fields,
            },
            headers: getBasicAuthHeader({ username, password }),
            maxRedirects: 0,
        },
    );

    return data;
};

export const getJiraAllBoardSprints = async (
    boardId: string,
    input: GetBoardSprintsInput,
) => {
    let startAt = 0;
    const sprints: Sprint[] = [];

    const response = await getJiraSprintPage(boardId, input, startAt);

    startAt = response.maxResults;
    sprints.push(...response.values);

    while (response.total > startAt) {
        const response = await getJiraSprintPage(boardId, input, startAt);
        sprints.push(...response.values);
        startAt = response.startAt + response.maxResults;
    }

    return sprints;
};

const getJiraSprintPage = async (
    boardId: string,
    input: GetBoardSprintsInput,
    startAt: Page['startAt'],
) => {
    const { username, password, originUrl } = input;
    const { data } =  await externalAxios.get<SprintResponse>(
        `${originUrl}/rest/agile/1.0/board/${boardId}/sprint`,
        {
            params: {
                ...(input?.state && { state: input.state }),
                maxResults: 50, // 50 is max value
                startAt,
            },
            headers: getBasicAuthHeader({ username, password }),
            maxRedirects: 0,
        },
    );

    return data;
};

/**
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-search/#api-rest-api-2-search-get
 */
export const getIssueWorklogsByParam = async <T extends CloudJiraUser | ServerJiraUser>(
    searchParam: GetIssueWorklogsByParam, input: GetWorklogInput
) => {
    let dateCondition = '';
    if (isJiraSingleDay(input)) {
        const date = dayjs(input.date, AVAILABLE_FORMATS).format('YYYY-MM-DD');
        dateCondition = `worklogDate=${date}`;
    } else if (isJiraDatesPeriod(input)) {
        const start = dayjs(input.startDate, AVAILABLE_FORMATS).format('YYYY-MM-DD');
        const end = dayjs(input.endDate, AVAILABLE_FORMATS).format('YYYY-MM-DD');
        dateCondition = `worklogDate>=${start} AND worklogDate<=${end}`;
    } else if (isJiraDatesCollection(input)) {
        const mappedDates = input.dates
            .map(date => dayjs(date, AVAILABLE_FORMATS).format('YYYY-MM-DD'))
            .join(',');
        dateCondition = `worklogDate in (${mappedDates})`;
    }

    const EPICFIELDS = 'cf[10014]'
    let jqlSearchParam = '';

    if (searchParam.param === 'worklogAuthor') {
        jqlSearchParam = `worklogAuthor=${searchParam.author}`;
    } else if (searchParam.param === 'epic') {
        jqlSearchParam = `${EPICFIELDS}=${searchParam.epic}`;
    } else if (searchParam.param === 'project') {
        jqlSearchParam = `project=${searchParam.project}`
    }

    const jql = `${dateCondition} AND ${jqlSearchParam}`;
    let startAt = 0;
    const issues: SearchIssue<T>[] = [];

    const response = await searchWorklogsGroupedBy<T>({
        input, jql, startAt,
    });
    startAt = response.maxResults;
    issues.push(...response.issues);

    while (response.total > startAt) {
        const response = await searchWorklogsGroupedBy<T>({
            input, jql, startAt,
        });
        issues.push(...response.issues);
        startAt = response.startAt + response.maxResults;
    }
    return issues;
};

const searchWorklogsGroupedBy = <T extends CloudJiraUser | ServerJiraUser>({
    input, jql, startAt,
}) => {
    const { username, password, originUrl } = input;
    return externalAxios.get<IssueWorklogResponse<T>>(
        `${originUrl}/rest/api/3/search/jql`,
        {
            headers: getBasicAuthHeader({ username, password }),
            params: {
                jql,
                startAt,
                maxResults: 100, // 100 is max value
                fields: '*all,-watches,-votes,-timetracking,-reporter,-progress,-issuerestriction,-issuelinks,-fixVersions,-comment,-attachment,-aggregateprogress,-assignee,-creator,-description,-duedate,-environment,-lastViewed,-resolution,-resolutiondate,-security,-statuscategorychangedate,-subtasks,-versions,-workratio,-timespent,-timeoriginalestimate,-timeestimate,-aggregatetimespent,-aggregatetimeoriginalestimate,-aggregatetimeestimate',
            },
            maxRedirects: 0,
        },
    )
        .then(response => response.data);
};

export const getDatesCollectionBoundaries = (dates: string[]) => {
    const datesObjects = dates.map(date => dayjs(date, AVAILABLE_FORMATS));
    const datesBoundaries = datesObjects.reduce<{ max: Dayjs; min: Dayjs }>((acc, date) => {
        if (!acc.max && !acc.min) return { max: date, min: date };

        if (date.valueOf() > acc.max.valueOf())
            return { ...acc, max: date };
        if (date.valueOf() < acc.min.valueOf())
            return { ...acc, min: date };
        return acc;
    }, { max: undefined, min: undefined });
    return {
        ...datesBoundaries,
        datesObjects,
    };
};

export const getIssueWorklogs = <T extends CloudJiraUser | ServerJiraUser>(issueKey: string, input: GetWorklogInput) => {
    let timeParam: { startedBefore: number; startedAfter: number; isCollection?: boolean; dates?: Dayjs[] };
    if (isJiraSingleDay(input)) {
        timeParam = {
            startedBefore: dayjs(input.date, AVAILABLE_FORMATS).endOf('day').valueOf(),
            startedAfter: dayjs(input.date, AVAILABLE_FORMATS).startOf('day').valueOf(),
        };
    } else if (isJiraDatesPeriod(input)) {
        timeParam = {
            startedBefore: dayjs(input.endDate, AVAILABLE_FORMATS).endOf('day').valueOf(),
            startedAfter: dayjs(input.startDate, AVAILABLE_FORMATS).startOf('day').valueOf(),
        };
    } else if (isJiraDatesCollection(input)) {
        const { datesObjects, min, max } = getDatesCollectionBoundaries(input.dates);
        timeParam = {
            startedBefore: max.endOf('day').valueOf(),
            startedAfter: min.startOf('day').valueOf(),
            isCollection: true,
            dates: datesObjects,
        };
    }

    return externalAxios.get<WorklogResponse<T>>(
        `${input.originUrl}/rest/api/3/issue/${issueKey}/worklog`,
        {
            headers: getBasicAuthHeader({ username: input.username, password: input.password }),
            params: {
                ...timeParam,
                maxResults: 1000,
            },
            maxRedirects: 0,
        },
    )
        .then(response => response.data)
        .then(data => {
            if (!timeParam.isCollection) return data;
            const filteredWorklogs = data.worklogs.filter(worklog => {
                const started = dayjs(worklog.started);
                return timeParam.dates.some(date => date.isSame(started, 'day'));
            });

            return {
                ...data,
                worklogs: filteredWorklogs,
            };
        });
};

export const sortAscending = <T extends CloudJiraUser | ServerJiraUser>(
    worklogs: WorklogOutput<T>[]
) => {
    return worklogs.sort((a, b) => dayjs(a.started).isBefore(dayjs(b.started)) ? -1 : 1);
};

export const groupByDay = <T extends CloudJiraUser | ServerJiraUser>(worklogs: WorklogOutput<T>[]) => {
    return _.groupBy(worklogs, (worklog) => dayjs(worklog.started).format('YYYY-MM-DD'));
};

export const isAllowedDate = <T extends CloudJiraUser | ServerJiraUser>({
    worklog, startDate, endDate, dates
}: WorklogAllowedDateParams<T>) => {
    const started = dayjs(worklog.started);

    if (!dates) return started.isAfter(startDate) && started.isBefore(endDate);

    return dates.some(date => date.isSame(started, 'day'));
};

export const isWorklogCreator = <T extends CloudJiraUser | ServerJiraUser>({
    worklog, jiraUser
}: WorklogIsCreatorParams<T>) =>
        isCloudJiraUser(worklog.author) &&
        isCloudJiraUser(jiraUser)
            ? worklog.author.accountId === jiraUser.accountId
            : isServerJiraUser(worklog.author) &&
                isServerJiraUser(jiraUser) &&
                worklog.author.key === jiraUser.key;
