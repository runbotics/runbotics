import { z } from 'zod';

export const createTenantSchema = z.object({
    name: z.string(),
}).required();

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
