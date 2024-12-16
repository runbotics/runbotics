import { z } from 'zod';

export const editProcessCredentialSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
});

export const editProcessCredentialsDto = z.object({
    credentials: z.array(editProcessCredentialSchema),
    templateId: z.string()
});

export type EditProcessCredentialDto = z.infer<typeof editProcessCredentialSchema>;
export type EditProcessCredentialsDto = z.infer<typeof editProcessCredentialsDto>;
