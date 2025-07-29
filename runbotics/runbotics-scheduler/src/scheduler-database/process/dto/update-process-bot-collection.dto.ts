import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { createZodDto } from 'nestjs-zod';

export const updateProcessBotCollectionSchema = createProcessSchema.pick({
    botCollection: true,
});

export class UpdateProcessBotCollectionSwaggerDto extends createZodDto(updateProcessBotCollectionSchema) {}
export type UpdateProcessBotCollectionDto = z.infer<typeof updateProcessBotCollectionSchema>;
