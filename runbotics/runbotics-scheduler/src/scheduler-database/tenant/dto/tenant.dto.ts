import { z } from 'zod';

export const BasicTenantDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    serviceTokenExpDate: z.string().optional().nullable()
});

export type BasicTenantDto = z.infer<typeof BasicTenantDtoSchema>;
