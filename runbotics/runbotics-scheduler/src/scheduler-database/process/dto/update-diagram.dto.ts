import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateDiagramSchema = z.object({
    definition: z.string(),
    globalVariableIds: z.array(z.string()),
    executionInfo: z.string().nullable(),
});

export class UpdateDiagramSwaggerDto extends createZodDto(updateDiagramSchema) {}
export type UpdateDiagramDto = z.infer<typeof updateDiagramSchema>;
