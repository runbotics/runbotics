import { z } from 'zod';

export const tagReferenceSchema = z
    .object({
        name: z.string(),
        tenantId: z.string().uuid().optional(),
    });

export type TagReference = z.infer<typeof tagReferenceSchema>;
