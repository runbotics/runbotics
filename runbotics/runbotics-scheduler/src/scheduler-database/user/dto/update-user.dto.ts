import { Role, UILanguage } from 'runbotics-common';
import { z } from 'zod';

export const updateUserSchema = z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    langKey: z.nativeEnum(UILanguage),
    activated: z.boolean(),
    tenantId: z.string(),
    roles: z.array(z.nativeEnum(Role)),
}).partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;