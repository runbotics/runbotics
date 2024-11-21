import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';

export const updateExecutionInfoSchema = createProcessSchema.pick({
    executionInfo: true,
});

export type UpdateExecutionInfoDto = z.infer<typeof updateExecutionInfoSchema>;
