import { z } from 'zod';

export const createCredentialSchema = z.object({
    name: z.string(),
    templateId: z.string(),
    description: z.string().optional(),
}).strict();

export type CreateCredentialDto = z.infer<typeof createCredentialSchema>;