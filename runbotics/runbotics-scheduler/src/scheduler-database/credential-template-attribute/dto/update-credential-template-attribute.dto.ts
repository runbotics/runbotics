import { z } from 'zod';
import { createCredentialTemplateAttributeSchema } from './create-credential-template-attribute.dto';

export const updateCredentialTemplateAttributeSchema = createCredentialTemplateAttributeSchema.pick({
    name: true,
    description: true,
});

export type UpdateCredentialTemplateAttributeDto = z.infer<typeof updateCredentialTemplateAttributeSchema>;
