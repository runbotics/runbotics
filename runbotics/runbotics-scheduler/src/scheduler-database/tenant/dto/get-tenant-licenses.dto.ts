import { z } from 'zod';

export const getTenantLicensesSchema = z
    .object({
        tenantId: z.string().min(2),
    })
    .required();

export type GetTenantLicensesDto = z.infer<typeof getTenantLicensesSchema>;
    