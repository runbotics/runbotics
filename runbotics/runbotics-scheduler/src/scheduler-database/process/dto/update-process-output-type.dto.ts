import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { createZodDto } from 'nestjs-zod';

export const updateProcessOutputTypeSchema = createProcessSchema.pick({
    output: true,
});

export class UpdateProcessOutputTypeSwaggerDto extends createZodDto(updateProcessOutputTypeSchema) {}
export type UpdateProcessOutputTypeDto = z.infer<typeof updateProcessOutputTypeSchema>;
