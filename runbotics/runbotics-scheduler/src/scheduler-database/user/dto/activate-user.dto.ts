import { Role } from 'runbotics-common';
import { z } from 'zod';

export const activateUserSchema = z.object({
    tenantId: z.string(),
    roles: z.array(z.nativeEnum(Role)),
    message: z.string(),
}).partial();

export type ActivateUserDto = z.infer<typeof activateUserSchema>;