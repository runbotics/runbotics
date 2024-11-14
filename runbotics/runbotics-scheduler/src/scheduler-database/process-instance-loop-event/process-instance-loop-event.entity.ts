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

@Entity({ name: 'process_instance_loop_event' })
@Unique(['executionId'])
export class ProcessInstanceLoopEvent {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @Column({
        type: 'timestamp without time zone',
        transformer: dateTransformer,
        nullable: true,
    })
    created: string;

    @Column({ type: 'character varying', length: 255, nullable: true })
    log: string;

    @Column({ type: 'character varying', length: 255 })
    step: string;

    @Column({
        name: 'iteration_number',
        type: 'numeric',
        transformer: numberTransformer,
    })
    iterationNumber: number;

    @Column({ type: 'character varying', length: 255, nullable: true })
    script: string;

    @Index('process_instance_loop_execution_id_idx')
    @Column({ name: 'execution_id', type: 'character varying', length: 255 })
    executionId: string;

    @Column({ type: 'text', nullable: true })
    input: string;

    @Column({ type: 'text', nullable: true })
    output: string;

    @Column({ name: 'process_instance_id', type: 'uuid', nullable: true })
    processInstanceId: ProcessInstance['id'];

    @ManyToOne(() => ProcessInstance, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_instance_id', referencedColumnName: 'id' })
    processInstance: ProcessInstance;

    @Column({
        type: 'timestamp without time zone',
        transformer: dateTransformer,
        nullable: true,
    })
    finished: string;

    @Column({ type: 'character varying', length: 255 })
    status: ProcessInstanceEventStatus;

    @Column({ type: 'text', nullable: true })
    error?: string;

    @Column({ name: 'loop_id', type: 'character varying', length: 255 })
    loopId: string;

    @Column({ name: 'iterator_element', type: 'jsonb', nullable: true })
    iteratorElement: JSON;
}
