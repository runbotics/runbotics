import { z } from 'zod';
import { BotSystem } from 'runbotics-common';

export const botSystemReferenceSchema = z.object({
    name: z.nativeEnum(BotSystem),
});

export type BotSystemReference = z.infer<typeof botSystemReferenceSchema>;
