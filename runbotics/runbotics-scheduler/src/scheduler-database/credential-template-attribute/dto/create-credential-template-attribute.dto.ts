import { CredentialTemplateAttributeType } from 'runbotics-common';
import { z } from 'zod';

export const createCredentialTemplateAttributeSchema = z.object({
    name: z.string(),
    type: z.nativeEnum(CredentialTemplateAttributeType),
    description: z.string().optional(),
});

export type CreateCredentialTemplateAttributeDto = z.infer<typeof createCredentialTemplateAttributeSchema>;
