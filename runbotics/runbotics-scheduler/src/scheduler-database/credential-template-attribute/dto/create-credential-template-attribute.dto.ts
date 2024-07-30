import { z } from 'zod';

export const createCredentialTemplateAttributeSchema = z.object({
    name: z.string(),
    type: z.string(),
    description: z.string().optional(),
}).strict();

export type CreateCredentialTemplateAttributeDto = z.infer<typeof createCredentialTemplateAttributeSchema>;
