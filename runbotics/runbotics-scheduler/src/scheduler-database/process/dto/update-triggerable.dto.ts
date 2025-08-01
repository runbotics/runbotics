import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { createZodDto } from 'nestjs-zod';

export const updateTriggerableSchema = createProcessSchema.pick({
    isTriggerable: true,
});

export class UpdateTriggerableSwaggerDto extends createZodDto(updateTriggerableSchema) {}
export type UpdateTriggerableDto = z.infer<typeof updateTriggerableSchema>;
