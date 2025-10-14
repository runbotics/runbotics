import { z } from 'zod';
import { userReferenceSchema } from '#/scheduler-database/user/dto/user-reference';
import { createZodDto } from 'nestjs-zod';

export const createProcessCollectionSchema = z.object({
    name: z.string().trim().min(1).max(255).describe('Name of the collection.'),
    description: z.string().trim().min(1).max(255).optional().nullable().describe('Description of the collection.'),
    isPublic: z.boolean().describe('Is this collection widely available under one tenant?'),
    users: z.array(userReferenceSchema).optional().describe('Array of users who have access to this collection.'),
    parentId: z.string().nullable().optional().describe('Id of a parent collection.'),
});

export class CreateProcessCollectionSwaggerDto extends createZodDto(createProcessCollectionSchema) {}
export type CreateProcessCollectionDto = z.infer<typeof createProcessCollectionSchema>;