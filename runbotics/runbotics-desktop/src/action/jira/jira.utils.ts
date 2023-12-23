import dayjs from 'dayjs';
import { GetWorklogBase, WorklogDay, WorklogPeriod } from './jira.types';
import z from 'zod';

export const isWorklogBase = (
    data: unknown
): data is GetWorklogBase => data
&& typeof data === 'object'
&& 'originEnv' in data && typeof data.originEnv === 'string'
&& 'userEnv' in data && typeof data.userEnv === 'string'
&& 'passwordEnv' in data && typeof data.passwordEnv === 'string'
&& 'email' in data && typeof data.email === 'string';

export const isWorklogPeriod = (
    data: unknown
): data is WorklogPeriod => isWorklogBase(data)
&& 'dateStart' in data && typeof data.dateStart === 'string'
&& 'dateEnd' in data && typeof data.dateEnd === 'string';

export const isWorklogDay = (
    data: unknown
): data is WorklogDay => isWorklogBase(data)
&& 'date' in data && typeof data.date === 'string';

const dateValidator = (property: string) => z.string({ required_error: `${property} property is missing` })
    .refine(date => dayjs(date).isValid(), `${property} is not a valid date`);

export const getWorklogInputBaseSchema = z.object({
    originEnv: z.string({ required_error: 'originEnv property is missing' }),
    userEnv: z.string({ required_error: 'userEnv property is missing' }),
    passwordEnv: z.string({ required_error: 'passwordEnv property is missing' }),
    email: z.string({ required_error: 'email property is missing' }).email(),
});

export const worklogDaySchema = z.object({
    date: dateValidator('date'),
});

export const worklogPeriodSchema = z.object({
    dateStart: dateValidator('dateStart'),
    dateEnd: dateValidator('dateEnd'),
});

export const getWorklogInputSchema = getWorklogInputBaseSchema.and(worklogDaySchema)
    .or(getWorklogInputBaseSchema.and(worklogPeriodSchema));
