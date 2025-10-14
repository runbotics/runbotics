import { createZodDto } from 'nestjs-zod';
import { EMAIL_TRIGGER_WHITELIST_PATTERN } from 'runbotics-common';
import { z } from 'zod';

export const updateTenantSchema = z
    .object({
        name: z.string().min(2).optional(),
        emailTriggerWhitelist: z.array(
            z.string().regex(EMAIL_TRIGGER_WHITELIST_PATTERN)
        ).optional(),
    });

export class UpdateTenantSwaggerDto extends createZodDto(updateTenantSchema) {}
export type UpdateTenantDto = z.infer<typeof updateTenantSchema>;
