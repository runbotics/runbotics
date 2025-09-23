import { z } from 'zod';

export const authSchema = z.object({
    username: z.string().trim().min(1).max(100),
    password: z.string()
        .trim()
        .min(14, 'Password must be at least 14 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, 'Password must include uppercase, lowercase, number, and special character'),
    rememberMe: z.boolean().optional(),
});

export type AuthDto = z.infer<typeof authSchema>;
