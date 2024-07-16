import { z } from 'zod';
import { GlobalVariableType } from 'runbotics-common';

export const createGlobalVariableSchema = z.object({
    name: z.string().max(255),
    value: z.string(),
    type: z.nativeEnum(GlobalVariableType),
    description: z.string().max(255).optional()
});

export type CreateGlobalVariableDto = z.infer<typeof createGlobalVariableSchema>;
