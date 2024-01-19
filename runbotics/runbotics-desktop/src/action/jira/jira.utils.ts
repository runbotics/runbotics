import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import {
    GetWorklogBase, GetWorklogInput, IssueWorklogResponse, WorklogCollection, WorklogDay,
    WorklogOutput, WorklogPeriod, WorklogResponse, WorklogAllowedDateParams, Worklog
} from './jira.types';
import { CloudJiraUser } from './jira-cloud/jira-cloud.types';
import { ServerJiraUser } from './jira-server/jira-server.types';
import { externalAxios } from '#config';
import _ from 'lodash';
import z from 'zod';

export const isWorklogBase = (
    data: unknown
): data is GetWorklogBase => data
&& typeof data === 'object'
&& 'originEnv' in data && typeof data.originEnv === 'string'
&& 'usernameEnv' in data && typeof data.usernameEnv === 'string'
&& 'passwordEnv' in data && typeof data.passwordEnv === 'string'
&& 'email' in data && typeof data.email === 'string';

export const isWorklogPeriod = (
    data: unknown
): data is WorklogPeriod => isWorklogBase(data)
&& 'startDate' in data && typeof data.startDate === 'string'
&& 'endDate' in data && typeof data.endDate === 'string';

export const isWorklogDay = (
    data: unknown
): data is WorklogDay => isWorklogBase(data)
&& 'date' in data && typeof data.date === 'string';

export const isWorklogCollection = (
    data: unknown
): data is WorklogCollection => isWorklogBase(data)
&& 'dates' in data && Array.isArray(data.dates) && typeof data.dates[0] === 'string';

export const isCloudJiraUser = (
    data: unknown
): data is CloudJiraUser => data
&& typeof data === 'object'
&& 'accountId' in data && typeof data.accountId === 'string';

const dateValidator = (property: string) => z.string({
    required_error: `${property} property is missing`
})
    .refine(
        date => dayjs(date, AVAILABLE_FORMATS, true).isValid(),
        date => ({ message: `${property}: "${date}" is not a valid date. Expected [${AVAILABLE_FORMATS.join(', ')}]` }),
    );

const envValidator = (property: string) => z.string({
    required_error: `${property} property is missing`
})
    .refine(
        env => Boolean(process.env[env]) && typeof process.env[env] === 'string',
        env => ({ message: `${property}: "${env}" is empty or does not exist` })
    );

export const AVAILABLE_FORMATS = [
    'D.M.YYYY', 'DD.MM.YYYY', 'D-M-YYYY', 'DD-MM-YYYY', 'D/M/YYYY', 'DD/MM/YYYY',
    'YYYY.M.D', 'YYYY.MM.DD', 'YYYY-M-D', 'YYYY-MM-DD', 'YYYY/M/D', 'YYYY/MM/DD'];

export const getWorklogInputBaseSchema = z.object({
    originEnv: envValidator('Origin'),
    usernameEnv: envValidator('Username'),
    passwordEnv: envValidator('Password'),
    email: z.string({ required_error: 'Email property is missing' }).email(),
    groupByDay: z.boolean().optional(),
});

export const worklogDaySchema = z.object({
    mode: z.literal('date').optional(),
    date: dateValidator('Date'),
});

export const worklogPeriodSchema = z.object({
    mode: z.literal('period').optional(),
    startDate: dateValidator('Start Date'),
    endDate: dateValidator('End Date'),
});

export const worklogCollectionSchema = z.object({
    mode: z.literal('collection').optional(),
    dates: z.array(dateValidator('Dates')),
});

export const getWorklogInputSchema = getWorklogInputBaseSchema.and(worklogDaySchema)
    .or(getWorklogInputBaseSchema.and(worklogPeriodSchema))
    .or(getWorklogInputBaseSchema.and(worklogCollectionSchema));

export const getBasicAuthHeader = (data: Pick<GetWorklogBase, 'passwordEnv' | 'usernameEnv'>) => {
    return {
        Authorization: 'Basic ' + Buffer.from(
            `${process.env[data.usernameEnv]}:${process.env[data.passwordEnv]}`
        ).toString('base64')
    };
};

/**
 * @throws when the specified user is not found
 */
export const getJiraUser = async <T extends CloudJiraUser | ServerJiraUser>(
    input: GetWorklogBase
) => {
    const { data } = await externalAxios.get<T[]>(
        `${process.env[input.originEnv]}/rest/api/2/user/search`,
        {
            params: {
                maxResults: 10,
                startAt: 0,
                query: input.email,
            },
            headers: getBasicAuthHeader(input),
            maxRedirects: 0,
        },
    );

    if (data.length === 0) {
        throw new Error(`User ${input.email} not found`);
    }

    return data[0];
};

export const getUserIssueWorklogs = <T extends CloudJiraUser | ServerJiraUser>(
    author: string, input: GetWorklogInput
) => {
    let dateCondition = '';
    if (isWorklogDay(input)) {
        const date = dayjs(input.date, AVAILABLE_FORMATS).format('YYYY-MM-DD');
        dateCondition = `worklogDate=${date}`;
    } else if (isWorklogPeriod(input)) {
        const start = dayjs(input.startDate, AVAILABLE_FORMATS).format('YYYY-MM-DD');
        const end = dayjs(input.endDate, AVAILABLE_FORMATS).format('YYYY-MM-DD');
        dateCondition = `worklogDate>=${start} AND worklogDate<=${end}`;
    } else if (isWorklogCollection(input)) {
        const mappedDates = input.dates
            .map(date => dayjs(date, AVAILABLE_FORMATS).format('YYYY-MM-DD'))
            .join(',');
        dateCondition = `worklogDate in (${mappedDates})`;
    }

    return externalAxios.get<IssueWorklogResponse<T>>(
        `${process.env[input.originEnv]}/rest/api/2/search`,
        {
            headers: getBasicAuthHeader(input),
            params: {
                jql: `${dateCondition} AND worklogAuthor=${author}`,
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
    } else if (isWorklogCollection(input)) {
        const { datesObjects, min, max } = getDatesCollectionBoundaries(input.dates);
        timeParam = {
            startedBefore: max.endOf('day').valueOf(),
            startedAfter: min.startOf('day').valueOf(),
            isCollection: true,
            dates: datesObjects,
        };
    }

    return externalAxios.get<WorklogResponse<T>>(
        `${process.env[input.originEnv]}/rest/api/2/issue/${issueKey}/worklog`,
        {
            headers: getBasicAuthHeader(input),
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
    worklog, startDate, endDate, jiraUser, dates
}: WorklogAllowedDateParams<T>) => {
    const started = dayjs(worklog.started);
    const isWorklogCreator = isCloudJiraUser(worklog.author) && isCloudJiraUser(jiraUser)
        ? worklog.author.accountId === jiraUser.accountId
        : (worklog.author as Worklog<ServerJiraUser>['author']).key === (jiraUser as ServerJiraUser).key;

    if (!dates) return isWorklogCreator
        && started.isAfter(startDate)
        && started.isBefore(endDate);

    return isWorklogCreator
        && dates.some(date => date.isSame(started, 'day'));
};
