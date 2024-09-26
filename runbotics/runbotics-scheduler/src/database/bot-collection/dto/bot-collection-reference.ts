import { z } from 'zod';
import { BotSystem } from 'runbotics-common';

export const botCollectionReferenceSchema = z.object({
    id: z.string(),
});

export type BotCollectionReference = z.infer<typeof botCollectionReferenceSchema>;
