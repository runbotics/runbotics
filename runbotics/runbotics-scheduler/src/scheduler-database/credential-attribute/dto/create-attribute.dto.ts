import { Reveal } from '#/utils/generic.types';
import { z } from 'zod';

export const createAttributeSchema = z.object({
    name: z.string(),
    value: z.string(),
    credentialId: z.string(),
    masked: z.boolean().optional(),
    description: z.string().optional(),
}).strict();

type PartialCreateAttributeDto = z.infer<typeof createAttributeSchema>;

export type CreateAttributeDto = Reveal<
    PartialCreateAttributeDto &
    Required<Pick<PartialCreateAttributeDto, 'name' | 'value' | 'credentialId'>>
>;