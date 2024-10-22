import { z } from 'zod';

export const tagReferenceSchema = z
    .object({
        id: z.number(),
    })
    .or(
        z.object({
            name: z.string(),
        })
    );

export type TagReference = z.infer<typeof tagReferenceSchema>;
