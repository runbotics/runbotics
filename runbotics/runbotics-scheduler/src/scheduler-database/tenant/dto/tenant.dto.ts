import { z } from 'zod';

export const tenantSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
}).required();

export type TenantDto = z.infer<typeof tenantSchema>;
