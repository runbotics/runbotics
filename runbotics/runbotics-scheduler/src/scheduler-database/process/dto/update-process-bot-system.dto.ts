import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';

export const updateProcessBotSystemSchema = createProcessSchema.pick({
    system: true,
});

export type UpdateProcessBotSystemDto = z.infer<typeof updateProcessBotSystemSchema>;
