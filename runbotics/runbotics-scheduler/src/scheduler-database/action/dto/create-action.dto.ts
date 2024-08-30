import { z } from 'zod';


export const createActionSchema = z.object({
    id: z.string().startsWith('external.').max(255),
    script: z.string().startsWith('external.').max(255),
    label: z.string().min(1).max(255),
    form: z.string()
}).required();

export type CreateActionDto = z.infer<typeof createActionSchema>;
