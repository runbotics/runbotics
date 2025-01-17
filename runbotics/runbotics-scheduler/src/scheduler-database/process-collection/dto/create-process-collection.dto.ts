import { z } from 'zod';
import { processCollectionReferenceSchema } from '#/scheduler-database/process-collection/dto/process-collection-reference';
import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';

export const createProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255).optional(),
    isPublic: z.boolean(),
    parent: processCollectionReferenceSchema.optional(),
    users: z.array(userReferenceSchema).optional(),
});

export type CreateProcessCollectionDto = z.infer<typeof createProcessCollectionSchema>;
