import { z } from 'zod';
import { createProcessSchema } from '#/database/process/dto/create-process.dto';

export const updateTriggerableSchema = createProcessSchema.pick({
    isTriggerable: true,
});

export type UpdateTriggerableDto = z.infer<typeof updateTriggerableSchema>;
