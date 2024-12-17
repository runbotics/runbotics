import { z } from 'zod';
import { createBotCollectionSchema } from '#/scheduler-database/bot-collection/dto/create-bot-collection.dto';

export const updateBotCollectionSchema = createBotCollectionSchema.optional();

export type UpdateBotCollectionDto = z.infer<typeof updateBotCollectionSchema>;
