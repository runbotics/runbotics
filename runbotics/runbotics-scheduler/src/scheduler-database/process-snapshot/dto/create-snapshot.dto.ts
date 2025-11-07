import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const createSnapshotSchema = z.object({
    name: z.string().max(255),
    description: z.string().min(1, 'Description is required').max(1000).optional(),
});

export type CreateSnapshotDto = z.infer<typeof createSnapshotSchema>;

export class CreateSnapshotSwaggerDto {
    @ApiProperty({
        description: 'Name for the snapshot',
        example: 'Initial Version',
        required: true,
        maxLength: 255,
    })
    name: string;

    @ApiProperty({
        description: 'Description of the snapshot',
        example: 'Snapshot created before major process changes',
        maxLength: 1000,
        required: false,
    })
    description: string;
}
