import { z } from 'zod';
import { createAttributeSchema } from './create-attribute.dto';

export const updateAttributeSchema = createAttributeSchema.pick({
    value: true,
    masked: true,
    description: true,
});

export type UpdateAttributeDto = z.infer<typeof updateAttributeSchema>;
