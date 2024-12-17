import { z } from 'zod';
import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';

export const createBotCollectionSchema = z.object({
    name: z.string().min(1),
    description: z.string().trim().or(z.null()).optional(),
    publicBotsIncluded: z.boolean().optional(),
    users: z.array(userReferenceSchema),
});

export type CreateBotCollectionDto = z.infer<typeof createBotCollectionSchema>;
