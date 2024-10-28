import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';

export const updateProcessOutputTypeSchema = createProcessSchema.pick({
    output: true,
});

export type UpdateProcessOutputTypeDto = z.infer<typeof updateProcessOutputTypeSchema>;
