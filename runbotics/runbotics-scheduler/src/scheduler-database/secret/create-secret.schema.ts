import { z } from 'zod';

// just an example of zod usage
export const createSecretSchema = z.object({
    data: z.string(),
}).required();

export type CreateSecretDto = z.infer<typeof createSecretSchema>;
