import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';
import { z } from 'zod';
import { processCollectionReferenceSchema } from './process-collection-reference';

export const UnmappedProcessCollectionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    is_public: z.boolean(),
    parent_id: z.string(),
    tenant_id: z.string(),
    created: z.string(),
    updated: z.string(),
    created_by: z.string(),
    email: z.string(),
    users: z.array(userReferenceSchema).optional(),
});

export type UnmappedProcessCollectionDto = z.infer<typeof UnmappedProcessCollectionSchema>;
