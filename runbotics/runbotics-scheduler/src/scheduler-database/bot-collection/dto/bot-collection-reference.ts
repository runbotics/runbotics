import { z } from 'zod';

export const botCollectionReferenceSchema = z.object({
    id: z.string(),
});

export type BotCollectionReference = z.infer<typeof botCollectionReferenceSchema>;
