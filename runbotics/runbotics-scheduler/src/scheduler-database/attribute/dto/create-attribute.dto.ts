import { z } from 'zod';

export const createAttributeSchema = z.object({
    value: z.string(),
    credentialId: z.string(),
    masked: z.boolean().optional(),
}).strict();

export type CreateAttributeDto = z.infer<typeof createAttributeSchema>;
