import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';
import { z } from 'zod';

export const ProcessCollectionWithUsersSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    is_public: z.boolean(),
    parent_id: z.string(),
    tenant_id: z.string(),
    created: z.string(),
    updated: z.string(),
    created_by: z.string(),
    email: z.string().email(),
    users: z.array(userReferenceSchema).optional(),
});

export type ProcessCollectionWithUsersDto = z.infer<typeof ProcessCollectionWithUsersSchema>;
