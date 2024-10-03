// import { Entity, Column, ManyToOne, JoinColumn, Generated, PrimaryColumn } from 'typeorm';
// import { IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus } from 'runbotics-common';
// import { dateTransformer, numberTransformer } from '../database.utils';
// import { ProcessInstance } from '#/scheduler-database/process-instance/process-instance.entity';

// @Entity({ name: 'process_instance_event', synchronize: false })
// export class ProcessInstanceEventEntity implements IProcessInstanceEvent {
//     @Generated()
//     @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
//         id: number;

//     @Column({ transformer: dateTransformer })
//         created: string;

//     @Column()
//         log: string;

//     @Column()
//         step: string;

//     @Column()
//         script: string;

//     @ManyToOne(() => ProcessInstance, { onDelete: 'CASCADE' })
//     @JoinColumn({ name: 'process_instance_id', referencedColumnName: 'id' })
//         processInstance: IProcessInstance;

//     @Column({ name: 'execution_id' })
//         executionId: string;

//     @Column()
//         error: string;

//     @Column()
//         input: string;

//     @Column()
//         output: string;

//     @Column({ transformer: dateTransformer })
//         finished: string;

//     @Column()
//         status: ProcessInstanceEventStatus;



// }
