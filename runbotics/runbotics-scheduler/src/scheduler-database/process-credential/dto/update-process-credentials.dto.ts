import { z } from 'zod';

export const editProcessCredentialSchema = z.object({
    id: z.string().uuid(),
    order: z.number(),
});

export const editProcessCredentialArrayDto = z.array(editProcessCredentialSchema);

export type EditProcessCredentialDto = z.infer<typeof editProcessCredentialSchema>;
export type EditProcessCredentialArrayDto = z.infer<typeof editProcessCredentialArrayDto>;
