import { z } from 'zod';

export const createScheduleProcessSchema = z.object({
    cron: z.string(),
    process: z.object({
        id: z.number(),
    }),
    inputVariables: z.string().nullable(),
}).required();

export type CreateScheduleProcessDto = z.infer<typeof createScheduleProcessSchema>;
