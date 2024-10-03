// import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { UserEntity } from '../user/user.entity';
// import { BotEntity } from '../bot/bot.entity';
// import { ProcessEntity } from '../process/process.entity';
// import { IProcess, IProcessInstance, IUser, ProcessInstanceStatus, IBot, ITriggerEvent, EmailTriggerData } from 'runbotics-common';
// import { dateTransformer } from '../database.utils';
// import { TriggerEventEntity } from '../trigger-event/trigger-event.entity';

// @Entity({ name: 'process_instance', synchronize: false })
// export class ProcessInstanceEntity implements IProcessInstance {
//     @PrimaryGeneratedColumn('uuid')
//         id: string;

//     @Column({ transformer: dateTransformer })
//         created: string;

//     @Column()
//         input: string;

//     @Column()
//         output: string;

//     @Column()
//         status: ProcessInstanceStatus;

//     @Column({ transformer: dateTransformer })
//         updated: string;

//     @Column({ name: 'orchestrator_process_instance_id' })
//         orchestratorProcessInstanceId: string;

//     @Column()
//         step: string;

//     @Column()
//         error: string;

//     @Column()
//         warning: boolean;

//     @Column('jsonb', { nullable: true, name: 'trigger_data' })
//         triggerData?: EmailTriggerData | unknown;

//     @Column({ name: 'root_process_instance_id', type: 'uuid' })
//         rootProcessInstanceId: string;

//     @Column({ name: 'parent_process_instance_id', type: 'uuid' })
//         parentProcessInstanceId: string;

//     @ManyToOne(() => TriggerEventEntity)
//     @JoinColumn({ name: 'trigger', referencedColumnName: 'name' })
//         trigger: ITriggerEvent;

//     @ManyToOne(() => BotEntity)
//     @JoinColumn({ name: 'bot_id', referencedColumnName: 'id' })
//         bot: IBot;

//     @ManyToOne(() => ProcessEntity)
//     @JoinColumn({ name: 'process_id', referencedColumnName: 'id' })
//         process: IProcess;

//     @ManyToOne(() => UserEntity)
//     @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
//         user: IUser;
// }
