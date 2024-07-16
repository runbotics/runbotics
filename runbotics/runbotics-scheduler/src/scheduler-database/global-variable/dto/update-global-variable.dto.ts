import { z } from 'zod';
import { GlobalVariableType } from 'runbotics-common';

export const updateGlobalVariableSchema = z.object({
    name: z.string().max(255),
    value: z.string(),
    type: z.nativeEnum(GlobalVariableType),
    description: z.string().max(255)
}).partial();

export type UpdateGlobalVariableDto = z.infer<typeof updateGlobalVariableSchema>;
