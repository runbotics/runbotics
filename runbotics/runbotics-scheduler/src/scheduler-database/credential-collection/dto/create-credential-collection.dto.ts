import { z } from 'zod';

export const createCredentialCollectionSchema = z.object({
    name: z.string(),
    templateId: z.string(),
    description: z.string().optional(),
});

export type CreateCredentialCollectionDto = z.infer<typeof createCredentialCollectionSchema>;
