import { z } from 'zod';
import { createProcessSchema } from '#/scheduler-database/process/dto/create-process.dto';

export const updateAttendedSchema = createProcessSchema.pick({
    isAttended: true,
});

export type UpdateAttendedDto = z.infer<typeof updateAttendedSchema>;
