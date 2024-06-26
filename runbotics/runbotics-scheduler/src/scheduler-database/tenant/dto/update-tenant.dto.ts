import { z } from 'zod';

export const updateTenantSchema = z.object({
    name: z.string().min(5)
}).required();

export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
