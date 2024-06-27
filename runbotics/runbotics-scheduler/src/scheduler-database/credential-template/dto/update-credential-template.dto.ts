import { z } from 'zod';
import { createCredentialTemplateSchema } from './create-credential-template.dto';

export const updateCredentialTemplateSchema = createCredentialTemplateSchema.pick({
    name: true,
    description: true,
    attributes: true,
});

export type UpdateCredentialTemplateDto = z.infer<typeof updateCredentialTemplateSchema>;
