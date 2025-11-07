import { ApiProperty } from '@nestjs/swagger';

export class ProcessSnapshotResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 1 })
    processId: number;

    @ApiProperty({ example: 'My Process' })
    processName: string;

    @ApiProperty({ example: 1 })
    versionNumber: number;

    @ApiProperty({ example: 'Initial Version' })
    name: string;

    @ApiProperty({
        example: 'Snapshot created before major process changes'
    })
    description: string;

    @ApiProperty({
        example: 'admin@example.com',
        description: 'Email of the user who created the snapshot'
    })
    createdByEmail: string;

    @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
    createdAt: string;
}

export class ProcessSnapshotDetailResponseDto extends ProcessSnapshotResponseDto {
    @ApiProperty({
        example: '<?xml version="1.0" encoding="UTF-8"?>...',
        description: 'Decompressed process definition'
    })
    processDefinition: string;
}
