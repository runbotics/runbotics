import { z } from 'zod';
import { createCredentialSchema } from './create-credential.dto';
import { Reveal } from '#/utils/generic.types';

export const updateCredentialSchema = createCredentialSchema.pick({
    name: true,
    description: true,
});

type PartialUpdateCredentialDto = z.infer<typeof updateCredentialSchema>;

export type UpdateCredentialDto = Reveal<
    PartialUpdateCredentialDto & Required<Pick<PartialUpdateCredentialDto, 'name'>>
>;
