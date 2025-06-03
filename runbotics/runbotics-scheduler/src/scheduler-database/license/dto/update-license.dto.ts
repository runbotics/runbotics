import { z } from 'zod';

export const updateLicenseSchema = z.object({
    expDate: z.string().date(),
    licenseKey: z.string().min(2).max(255),
    license: z.string().min(2).max(255),
});

export type UpdateLicenseDto = z.infer<typeof updateLicenseSchema>;
