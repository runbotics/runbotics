import { z } from 'zod';

export const createAttributeSchema = z.object({
    name: z.string(),
    value: z.string(),
    credentialId: z.string(),
    masked: z.boolean().optional(),
    description: z.string().optional(),
}).strict();

export type CreateAttributeDto = z.infer<typeof createAttributeSchema>;
