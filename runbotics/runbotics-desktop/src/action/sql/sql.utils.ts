import { z } from 'zod';

export const sqlQueryActionInputSchema = z.object({
    query: z.string(),
    queryParams: z.array(z.string().or(z.number()).or(z.null())).optional(),
});

export const sqlCredentialsSchema = z.object({
    url: z.string(),
});