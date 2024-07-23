import { CredentialTemplateAttributeType } from 'runbotics-common';
import { z } from 'zod';

export const createCredentialTemplateAttributeSchema = z.object({
    name: z.string(),
    type: z.nativeEnum(CredentialTemplateAttributeType),
    required: z.boolean(),
    description: z.string().optional(),
}).strict();

export type CreateCredentialTemplateAttributeDto = z.infer<typeof createCredentialTemplateAttributeSchema>;
