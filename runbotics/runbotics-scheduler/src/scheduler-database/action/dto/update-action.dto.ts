import { z } from 'zod';

export const updateActionSchema = z
    .object({
        script: z
            .string()
            .startsWith('external.', { message: 'Must start with "external."' })
            .max(255),
        label: z.string().min(1).max(255),
        form: z.string(),
    })
    .partial();

export type UpdateActionDto = z.infer<typeof updateActionSchema>;
