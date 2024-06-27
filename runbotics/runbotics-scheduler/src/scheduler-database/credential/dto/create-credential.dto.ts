import { z } from 'zod';

export const createCredentialSchema = z.object({
    name: z.string(),
    templateId: z.string(),
    description: z.string().optional(),
});

export type CreateCredentialDto = z.infer<typeof createCredentialSchema>;
