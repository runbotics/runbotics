import { z } from 'zod';

export const updateDiagramSchema = z.object({
    definition: z.string(),
    globalVariableIds: z.array(z.string()),
    executionInfo: z.string().nullable(),
});

export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;
