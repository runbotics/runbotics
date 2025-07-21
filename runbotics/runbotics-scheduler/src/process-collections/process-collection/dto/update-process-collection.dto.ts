import { z } from 'zod';
import { userReferenceSchema } from './user.dto';

export const updateProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255).optional().nullable(),
    parentId: z.string().nullable().optional(),
    users: z.array(userReferenceSchema).optional(),
});

export type UpdateProcessCollectionDto = z.infer<typeof updateProcessCollectionSchema>;
