import { z } from 'zod';

export const updateUserSchema = z.object({
    email: z.string().email(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    langKey: z.string(),
    activated: z.boolean(),
}).partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
