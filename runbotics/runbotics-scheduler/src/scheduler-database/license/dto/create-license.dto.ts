import { z } from 'zod';

export const createLicenseSchema = z
    .object({
        pluginName: z.string().min(2),
        tenantId: z.string().uuid(),
        licenseKey: z.string().min(2).max(255),
        license: z.string().min(2),
        expDate: z.string().date(),
    })
    .required();

export type CreateLicenseDto = z.infer<typeof createLicenseSchema>;
