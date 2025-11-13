import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { numberTransformer } from '#/database/database.utils';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'process_snapshot' })
export class ProcessSnapshotEntity {
    @ApiProperty({ example: 1 })
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    @Generated()
    id: number;

    @ApiProperty({ example: 1 })
    @Column({ name: 'process_id', type: 'bigint', transformer: numberTransformer })
    processId: number;

    @ApiProperty({ example: 1 })
    @Column({ name: 'version_number', type: 'integer' })
    versionNumber: number;

    @ApiProperty({ example: 'Initial Version' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({
        example: 'Snapshot created before major process changes',
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        example: 'H4sIAAAAAAAAA...',
        description: 'GZIP compressed process definition',
    })
    @Column({ name: 'process_definition', type: 'bytea' })
    processDefinition: Buffer;

    @ApiProperty({ example: 1 })
    @Column({ name: 'created_by_id', type: 'bigint', transformer: numberTransformer })
    createdById: number;

    @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
    @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
    createdAt: string;
    
    @ManyToOne(() => ProcessEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: User;
}
