import { z } from 'zod';

export const userReferenceSchema = z.object({
    id: z.number(),
}).required();

export type UserReference = z.infer<typeof userReferenceSchema>;
