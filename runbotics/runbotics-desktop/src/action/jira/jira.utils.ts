import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { GetWorklogBase, WorklogDay, WorklogPeriod } from './jira.types';
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

const dateValidator = (property: string) => z.string({
    required_error: `${property} property is missing`
})
    .refine(
        date => dayjs(date, AVAILABLE_FORMATS, true).isValid(),
        date => ({ message: `${property}: "${date}" is not a valid date. Expected "DD-MM-YYYY", "DD/MM/YYYY" or "DD.MM.YYYY"` }),
    );

const envValidator = (property: string) => z.string({
    required_error: `${property} property is missing`
})
    .refine(
        env => Boolean(process.env[env]) && typeof process.env[env] === 'string',
        env => ({ message: `${property}: "${env}" is empty or does not exist` })
    );

export const AVAILABLE_FORMATS = ['DD.MM.YYYY', 'DD-MM-YYYY', 'DD/MM/YYYY'];

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

export const getWorklogInputSchema = getWorklogInputBaseSchema.and(worklogDaySchema)
    .or(getWorklogInputBaseSchema.and(worklogPeriodSchema));
