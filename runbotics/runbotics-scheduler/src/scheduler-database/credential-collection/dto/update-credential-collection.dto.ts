import { z } from 'zod';
import { createCredentialCollectionSchema } from './create-credential-collection.dto';

export const updateCredentialCollectionSchema = createCredentialCollectionSchema.pick({
    name: true,
    description: true,
});

export type UpdateCredentialCollectionDto = z.infer<typeof updateCredentialCollectionSchema>;
