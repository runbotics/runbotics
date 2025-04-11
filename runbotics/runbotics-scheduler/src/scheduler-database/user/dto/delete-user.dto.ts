import { z } from 'zod';

export const deleteUserSchema = z.object({
    declineReason: z.string().trim().min(1).optional(),
});

export type DeleteUserDto = z.infer<typeof deleteUserSchema>;