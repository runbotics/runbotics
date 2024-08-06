import { Reveal } from '#/utils/generic.types';
import { z } from 'zod';

export const createCredentialSchema = z.object({
    name: z.string(),
    templateId: z.string(),
    description: z.string().optional(),
}).strict();

type PartialCreateCredentialDto = z.infer<typeof createCredentialSchema>;

export type CreateCredentialDto = Reveal<
    PartialCreateCredentialDto &
    Required<Pick<PartialCreateCredentialDto, 'name' | 'templateId'>>
>;