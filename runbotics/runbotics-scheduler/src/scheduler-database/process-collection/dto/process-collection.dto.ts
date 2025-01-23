import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';
import { z } from 'zod';
import { processCollectionReferenceSchema } from './process-collection-reference';

export const ProcessCollectionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    isPublic: z.boolean(),
    parent: z.lazy(() => processCollectionReferenceSchema.optional()),
    tenantId: z.string(),
    created: z.string(),
    updated: z.string(),
    createdBy: userReferenceSchema.optional(),
    users: z.array(userReferenceSchema).optional(),
});

export type ProcessCollectionDto = z.infer<typeof ProcessCollectionSchema>;
