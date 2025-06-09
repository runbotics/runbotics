import { z } from 'zod';


export const getGlobalVariableSchema = z.object({
    search: z.string().trim().optional(),
    sortField: z.string().trim().default('lastModified'),
    sortDirection: z.enum(['ASC', 'DESC', '']).default('DESC'),
});

export type GetGlobalVariableDto = z.infer<typeof getGlobalVariableSchema>;