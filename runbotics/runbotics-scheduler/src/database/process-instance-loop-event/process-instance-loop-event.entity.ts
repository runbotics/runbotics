import { Entity, Column, ManyToOne, JoinColumn, Generated, PrimaryColumn } from 'typeorm';
import { ProcessInstanceEntity } from '../process-instance/process-instance.entity';
import { IProcessInstance, IProcessInstanceLoopEvent, ProcessInstanceEventStatus } from 'runbotics-common';
import { dateTransformer, numberTransformer } from '../database.utils';

@Entity({ name: 'process_instance_loop_event', synchronize: false })
export class ProcessInstanceLoopEventEntity implements IProcessInstanceLoopEvent {
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
    @Column({name: 'iteration_number'})
        iterationNumber: number;

    @Column({name: 'iterator_element', type: 'jsonb'})
        iteratorElement: JSON;

    @Column({name: 'loop_id'})
        loopId: string;
}
