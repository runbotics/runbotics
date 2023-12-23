import z from 'zod';
import { getWorklogInputBaseSchema, getWorklogInputSchema, worklogDaySchema, worklogPeriodSchema } from './jira.utils';

export type GetWorklogBase = z.infer<typeof getWorklogInputBaseSchema>
export type WorklogDay = z.infer<typeof worklogDaySchema>
export type WorklogPeriod = z.infer<typeof worklogPeriodSchema>
export type GetWorklogInput = z.infer<typeof getWorklogInputSchema>

export interface Page {
    maxResults: number;
    startAt: number;
    total: number;
}
