import { z } from 'zod';

export const updateLicenseSchema = z.object({
    expDate: z.string().date(),
});

export type UpdateLicenseDto = z.infer<typeof updateLicenseSchema>;
