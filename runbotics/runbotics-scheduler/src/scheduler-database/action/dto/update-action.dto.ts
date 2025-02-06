import { ActionCredentialType } from 'runbotics-common';
import { z } from 'zod';

export const updateActionSchema = z
    .object({
        script: z
            .string()
            .startsWith('external.', { message: 'Must start with "external."' })
            .trim()
            .min(10)
            .max(255),
        label: z.string().trim().min(1).max(255),
        credentialType: z.nativeEnum(ActionCredentialType).optional(),
        form: z.string(),
    })
    .partial();

export type UpdateActionDto = z.infer<typeof updateActionSchema>;
