import { z } from 'zod';

export const processCollectionReferenceSchema = z.object({
    id: z.string(),
});

export type ProcessCollectionReference = z.infer<typeof processCollectionReferenceSchema>;
