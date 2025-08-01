import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';
import { createZodDto } from 'nestjs-zod';

export const updateAttendedSchema = createProcessSchema.pick({
    isAttended: true,
});

export class UpdateAttendedSwaggerDto extends createZodDto(updateAttendedSchema) {}
export type UpdateAttendedDto = z.infer<typeof updateAttendedSchema>;
