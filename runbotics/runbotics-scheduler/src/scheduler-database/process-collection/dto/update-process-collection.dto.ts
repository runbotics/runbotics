import { z } from 'zod';
import { processCollectionReferenceSchema } from '#/scheduler-database/process-collection/dto/process-collection-reference';
import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';
import { createZodDto } from 'nestjs-zod';

export const updateProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255),
    description: z.string().trim().min(1).max(255).optional().nullable(),
    isPublic: z.boolean().optional(),
    parentId: z.string().nullable().optional(),
    users: z.array(userReferenceSchema).optional(),
});

export class UpdateProcessCollectionSwaggerDto extends createZodDto(updateProcessCollectionSchema) {}
export type UpdateProcessCollectionDto = z.infer<typeof updateProcessCollectionSchema>;
