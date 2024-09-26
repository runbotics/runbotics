import { z } from 'zod';
import { createProcessSchema } from '#/database/process/dto/create-process.dto';

export const updateProcessBotCollectionSchema = createProcessSchema.pick({
    botCollection: true,
});

export type UpdateProcessBotCollectionDto = z.infer<typeof updateProcessBotCollectionSchema>;
