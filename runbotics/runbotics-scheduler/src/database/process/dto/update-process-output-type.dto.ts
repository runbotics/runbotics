import { z } from 'zod';
import { createProcessSchema } from '#/database/process/dto/create-process.dto';

export const updateProcessOutputTypeSchema = createProcessSchema.pick({
    outputType: true,
});

export type UpdateProcessOutputTypeDto = z.infer<typeof updateProcessOutputTypeSchema>;
