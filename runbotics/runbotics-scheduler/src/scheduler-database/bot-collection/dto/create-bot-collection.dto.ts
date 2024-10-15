import { z } from 'zod';
import { userReferenceSchema } from '#/database/user/dto/user-reference';

export const createBotCollectionSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    publicBotsIncluded: z.boolean().optional(),
    users: z.array(userReferenceSchema),
})

export type CreateBotCollectionDto = z.infer<typeof createBotCollectionSchema>;
