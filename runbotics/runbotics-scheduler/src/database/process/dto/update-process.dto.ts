import { z } from 'zod';
import { createProcessSchema } from '#/database/process/dto/create-process.dto';

export const updateProcessSchema = createProcessSchema.omit({
    processCollection: true,
});

export type UpdateProcessDto = z.infer<typeof updateProcessSchema>;
