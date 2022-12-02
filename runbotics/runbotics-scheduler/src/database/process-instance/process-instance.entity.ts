import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BotEntity } from '../bot/bot.entity';
import { ProcessEntity } from '../process/process.entity';
import { IProcess, IProcessInstance, IUser, ProcessInstanceStatus, IBot } from 'runbotics-common';
import { dateTransformer } from '../database.utils';
import { IProcessTrigger } from 'runbotics-common/dist/model/api/process-trigger.model';
import { ProcessTriggerEntity } from '../process-trigger/process-trigger.entity';

@Entity({ name: 'process_instance' })
export class ProcessInstanceEntity implements IProcessInstance {
    @PrimaryGeneratedColumn('uuid')
        id: string;

    @Column({ transformer: dateTransformer })
        created: string;

    @Column()
        input: string;

    @Column()
        output: string;

    @Column()
        status: ProcessInstanceStatus;

    @Column({ transformer: dateTransformer })
        updated: string;

    @Column({ name: 'orchestrator_process_instance_id' })
        orchestratorProcessInstanceId: string;

    @Column()
        step: string;

    @Column()
        error: string;

    @Column({ name: 'triggered_by' })
        triggeredBy: string;
        
    @Column({ name: 'root_process_instance_id', type: 'uuid' })
        rootProcessInstanceId: string;
        
    @ManyToOne(() => ProcessTriggerEntity)
    @JoinColumn({ name: 'trigger', referencedColumnName: 'name' })
        trigger: IProcessTrigger;
    
    @ManyToOne(() => BotEntity)
    @JoinColumn({ name: 'bot_id', referencedColumnName: 'id' })
        bot: IBot;

    @ManyToOne(() => ProcessEntity)
    @JoinColumn({ name: 'process_id', referencedColumnName: 'id' })
        process: IProcess;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
        user: IUser;
}