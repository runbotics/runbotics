import { z } from 'zod';
import { BotSystem } from 'runbotics-common';

export const processCollectionReferenceSchema = z.object({
    id: z.string(),
});

export type ProcessCollectionReference = z.infer<typeof processCollectionReferenceSchema>;
