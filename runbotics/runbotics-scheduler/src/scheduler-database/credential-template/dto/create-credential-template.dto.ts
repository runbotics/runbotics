import { z } from 'zod';
import { createCredentialTemplateAttributeSchema } from '#/scheduler-database/credential-template-attribute/dto/create-credential-template-attribute.dto';

export const createCredentialTemplateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  attributes: z.array(createCredentialTemplateAttributeSchema),
  isForTenantOnly: z.boolean(),
}).strict();

export type CreateCredentialTemplateDto = z.infer<typeof createCredentialTemplateSchema>;
