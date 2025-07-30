import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { createZodDto } from 'nestjs-zod';

export const updateExecutionInfoSchema = createProcessSchema.pick({
    executionInfo: true,
});

export class UpdateExecutionInfoSwaggerDto extends createZodDto(updateExecutionInfoSchema) {}
export type UpdateExecutionInfoDto = z.infer<typeof updateExecutionInfoSchema>;
