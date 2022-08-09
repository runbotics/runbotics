import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessInstanceEntity } from '../process_instance/process_instance.entity';
import { IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus } from 'runbotics-common';
import { dateTransformer } from '../database.utils';

@Entity({ name: 'process_instance_event' })
export class ProcessInstanceEventEntity implements IProcessInstanceEvent {
    @PrimaryGeneratedColumn()
        id: number;

    @Column({ transformer: dateTransformer })
        created: string;

    @Column()
        log: string;

    @Column()
        step: string;

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