import { z } from 'zod';

export const createTenantSchema = z.object({
    name: z.string().min(5)
}).required();

export type CreateTenantDto = z.infer<typeof createTenantSchema>;
