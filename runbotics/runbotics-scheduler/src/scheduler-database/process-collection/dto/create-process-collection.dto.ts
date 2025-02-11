import { z } from 'zod';
import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';

export const createProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255).optional().nullable(),
    isPublic: z.boolean(),
    users: z.array(userReferenceSchema).optional(),
    parentId: z.string().nullable().optional(),
});

export type CreateProcessCollectionDto = z.infer<typeof createProcessCollectionSchema>;
