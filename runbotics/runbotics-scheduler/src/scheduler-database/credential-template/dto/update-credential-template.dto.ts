import { z } from 'zod';
import { createCredentialTemplateAttributeSchema } from '#/scheduler-database/credential-template-attribute/dto/create-credential-template-attribute.dto';

export const updateCredentialTemplateSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    attributes: z.array(createCredentialTemplateAttributeSchema),
    isForTenantOnly: z.boolean(),
    credentialTemplateId: z.string().optional(),
  });

export type UpdateCredentialTemplateDto = z.infer<typeof updateCredentialTemplateSchema>;
