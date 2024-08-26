import { z } from 'zod';
import { createAttributeSchema } from './create-attribute.dto';
import { Reveal } from '#/utils/generic.types';

export const updateAttributeSchema = createAttributeSchema.pick({
    value: true,
    masked: true,
});

type PartialUpdateAttributeDto = z.infer<typeof updateAttributeSchema>;

export type UpdateAttributeDto = Reveal<
    PartialUpdateAttributeDto &
    Required<Pick<PartialUpdateAttributeDto, 'value'>>
>;