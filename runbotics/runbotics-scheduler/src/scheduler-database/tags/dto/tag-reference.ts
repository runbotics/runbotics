import { z } from 'zod';

export const tagReferenceSchema = z.object({
    id: z.number(),
}).required();

export type TagReference = z.infer<typeof tagReferenceSchema>;
