import { Entity, Column, ManyToOne, JoinColumn, Generated, PrimaryColumn } from 'typeorm';
import { ProcessInstanceEntity } from '../process-instance/process-instance.entity';
import { IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus } from 'runbotics-common';
import { dateTransformer, numberTransformer } from '../database.utils';

@Entity({ name: 'process_instance_event' })
export class ProcessInstanceEventEntity implements IProcessInstanceEvent {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
        id: number;

    @Column({ transformer: dateTransformer })
        created: string;

    @Column()
        log: string;

    @Column()
        step: string;

    @Column()
        script: string;

    @ManyToOne(() => ProcessInstanceEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_instance_id', referencedColumnName: 'id' })
        processInstance: IProcessInstance;

    @Column({ name: 'execution_id' })
        executionId: string;

    @Column()
        error: string;

    @Column()
        input: string;

    @Column()
        output: string;

    @Column({ transformer: dateTransformer })
        finished: string;

    @Column()
        status: ProcessInstanceEventStatus;



}