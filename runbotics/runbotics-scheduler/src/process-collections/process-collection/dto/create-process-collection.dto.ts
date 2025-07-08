import { z } from 'zod';
import { userReferenceSchema } from './user.dto';

export const createProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255).optional().nullable(),
    isPublic: z.boolean().default(false),
    users: z.array(userReferenceSchema).optional(),
    parentId: z.string().nullable().optional(),
    tenantId: z.string().optional(),
});

export type CreateProcessCollectionDto = z.infer<typeof createProcessCollectionSchema>;
