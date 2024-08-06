import { z } from 'zod';

export const createTagSchema = z.object({
    name: z.string().trim().min(1).max(20)
});


export type CreateTagDto = z.infer<typeof createTagSchema>;
