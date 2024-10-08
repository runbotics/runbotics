import { z } from 'zod';
import { BotSystemType } from 'runbotics-common';

export const botSystemReferenceSchema = z.object({
    name: z.nativeEnum(BotSystemType),
});

export type BotSystemReference = z.infer<typeof botSystemReferenceSchema>;
