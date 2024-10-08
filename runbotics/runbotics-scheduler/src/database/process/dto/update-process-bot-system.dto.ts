import { z } from 'zod';
import { createProcessSchema } from '#/database/process/dto/create-process.dto';

export const updateProcessBotSystemDto = createProcessSchema.pick({
    system: true,
});

export type UpdateProcessBotSystemDto = z.infer<typeof updateProcessBotSystemDto>;
