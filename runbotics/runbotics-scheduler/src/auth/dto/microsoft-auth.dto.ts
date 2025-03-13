import { z } from 'zod';

export const microsoftAuthSchema = z.object({
    langKey: z.string().trim().min(1).max(10),
    idToken: z.string().trim().min(1),
});

export type MicrosoftAuthDto = z.infer<typeof microsoftAuthSchema>;
