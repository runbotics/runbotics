import { z } from 'zod';

export const sqlQueryActionInputSchema = z.object({
    query: z.string(),
    queryParams: z.array(
        z.string().or(z.number()).nullable()
    ).optional(),
});

export const sqlCredentialsSchema = z.object({
    url: z.string(),
});