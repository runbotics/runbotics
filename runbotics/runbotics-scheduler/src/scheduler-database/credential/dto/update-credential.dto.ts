import { z } from 'zod';
import { createCredentialSchema } from './create-credential.dto';

export const updateCredentialSchema = createCredentialSchema.pick({
    name: true,
    description: true,
});

export type UpdateCredentialDto = z.infer<typeof updateCredentialSchema>;
