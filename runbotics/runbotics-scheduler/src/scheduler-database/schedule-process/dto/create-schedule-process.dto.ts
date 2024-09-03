import { z } from 'zod';

export const createScheduleProcessSchema = z.object({
    cron: z.string(),
    processId: z.number(),
    inputVariables: z.string().optional(),
}).required();

export type CreateScheduleProcessDto = z.infer<typeof createScheduleProcessSchema>;
