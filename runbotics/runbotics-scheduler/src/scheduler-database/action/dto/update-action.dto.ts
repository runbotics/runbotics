import { z } from 'zod';

export const updateActionSchema = z
    .object({
        script: z
            .string()
            .startsWith('external.', { message: 'Must start with "external."' })
            .min(10)
            .max(255)
            .trim(),
        label: z.string().min(1).max(255).trim(),
        form: z.string(),
    })
    .partial();

export type UpdateActionDto = z.infer<typeof updateActionSchema>;
