import { z } from 'zod';
import { userReferenceSchema } from './user.dto';
import { createZodDto } from 'nestjs-zod';

export const updateProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255).optional().nullable(),
    parentId: z.string().nullable().optional(),
    users: z.array(userReferenceSchema).optional(),
});

export class UpdateProcessCollectionZodDto extends createZodDto(updateProcessCollectionSchema) {
}

export type UpdateProcessCollectionDto = z.infer<typeof updateProcessCollectionSchema>;
