import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    Generated,
    PrimaryColumn,
    Index,
    Unique,
} from 'typeorm';
import { ProcessInstanceEventStatus } from 'runbotics-common';
import { ProcessInstance } from '#/scheduler-database/process-instance/process-instance.entity';
import { dateTransformer, numberTransformer } from '#/database/database.utils';

@Entity({ name: 'process_instance_event' })
@Unique(['executionId'])
export class ProcessInstanceEvent {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @Column({
        type: 'timestamp without time zone',
        transformer: dateTransformer,
        nullable: true,
    })
    created: string;

    @Column({ type: 'text', nullable: true })
    log: string;

    @Index('process_instance_event_process_instance_id_idx')
    @Column({ name: 'process_instance_id', type: 'uuid', nullable: true })
    processInstanceId: ProcessInstance['id'];

    @ManyToOne(() => ProcessInstance, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_instance_id', referencedColumnName: 'id' })
    processInstance: ProcessInstance;

    @Column({ type: 'character varying', length: 255, nullable: true })
    step: string;

    @Column({
        name: 'execution_id',
        type: 'character varying',
        length: 255,
        nullable: true,
    })
    executionId: string;

    @Column({ type: 'text', nullable: true })
    input?: string;

    @Column({ type: 'text', nullable: true })
    output?: string;

    @Column({
        type: 'timestamp without time zone',
        transformer: dateTransformer,
        nullable: true,
    })
    finished: string;

    @Column({ type: 'character varying', length: 255, nullable: true })
    status: ProcessInstanceEventStatus;

    @Column({ type: 'text', nullable: true })
    error?: string;

    @Column({ type: 'character varying', length: 255, nullable: true })
    script?: string;
}
