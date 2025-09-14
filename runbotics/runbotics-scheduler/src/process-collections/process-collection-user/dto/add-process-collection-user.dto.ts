import { PrivilegeType } from 'runbotics-common';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const addProcessCollectionUserDtoSchema = z.object({
    privilegeType: z.nativeEnum(PrivilegeType),
    userId: z.number().optional(),
    collectionId: z.string(),
});

export class AddProcessCollectionUserZodDto extends createZodDto(addProcessCollectionUserDtoSchema) {
}
export type AddProcessCollectionUserDto = z.infer<typeof addProcessCollectionUserDtoSchema>;
