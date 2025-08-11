import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { createZodDto } from 'nestjs-zod';

export const updateProcessBotSystemSchema = createProcessSchema.pick({
    system: true,
});

export class UpdateProcessBotSystemSwaggerDto extends createZodDto(updateProcessBotSystemSchema) {}
export type UpdateProcessBotSystemDto = z.infer<typeof updateProcessBotSystemSchema>;
