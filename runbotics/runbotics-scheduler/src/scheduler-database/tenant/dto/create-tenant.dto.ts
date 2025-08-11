import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createTenantSchema = z.object({
    name: z.string().min(2)
}).required();

export class CreateTenantSwaggerDto extends createZodDto(createTenantSchema) {}
export type CreateTenantDto = z.infer<typeof createTenantSchema>;
