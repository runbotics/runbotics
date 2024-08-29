import { z } from 'zod';

export const createProcessCredentialSchema = z.object({
    credentialId: z.string().uuid(),
    templateName: z.string(),
    processId: z.string(),
});

export type CreateProcessCredentialDto = z.infer<typeof createProcessCredentialSchema>;
