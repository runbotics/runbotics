import { BotEntity } from '../bot/bot.entity';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import { User } from '#/scheduler-database/user/user.entity';
import {
    EmailTriggerData,
    ProcessInstanceStatus,
    ITriggerEvent,
    TriggerEvent as TriggerEventName,
    UserTriggerData,
} from 'runbotics-common';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcessEntity } from '../process/process.entity';
import { TriggerEvent } from '../trigger-event/trigger-event.entity';

@Entity({ name: 'process_instance' })
export class ProcessInstance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'timestamp without time zone',
        transformer: dateTransformer,
        nullable: true,
    })
    created: string;

    @Column({ type: 'text', nullable: true })
    input?: string;

    @Column({ type: 'text', nullable: true })
    output?: string;

    @Column({ type: 'character varying', length: 255, nullable: true })
    status: ProcessInstanceStatus;

    @Column({
        type: 'timestamp without time zone',
        transformer: dateTransformer,
        nullable: true,
    })
    updated?: string;

    @Column({
        name: 'bot_id',
        type: 'bigint',
        transformer: numberTransformer,
        nullable: true,
    })
    botId?: BotEntity['id'];

    @ManyToOne(() => BotEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'bot_id' })
    bot: BotEntity;

    @Index('process_instance_process_id_idx')
    @Column({
        name: 'process_id',
        type: 'bigint',
        transformer: numberTransformer,
        nullable: true,
    })
    processId: ProcessEntity['id'];

    @ManyToOne(() => ProcessEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @Column({
        name: 'orchestrator_process_instance_id',
        type: 'character varying',
        length: 255,
        nullable: true,
    })
    orchestratorProcessInstanceId?: string;

    @Column({ type: 'character varying', length: 255, nullable: true })
    step?: string;

    @Index('process_instance_root_process_instance_id_idx')
    @Column({ name: 'root_process_instance_id', type: 'uuid', nullable: true })
    rootProcessInstanceId?: string;

    @Column({
        name: 'user_id',
        type: 'bigint',
        transformer: numberTransformer,
        default: 1,
        nullable: true,
    })
    userId: User['id'];

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'text', nullable: true })
    error?: string;

    @ManyToOne(() => TriggerEvent)
    @Column({
        type: 'character varying',
        length: 50,
        default: TriggerEventName.MANUAL,
        nullable: true,
    })
    @JoinColumn({ name: 'trigger', referencedColumnName: 'name' })
    trigger: ITriggerEvent;

    @Column({ name: 'trigger_data', type: 'jsonb', nullable: true })
    triggerData?: EmailTriggerData | UserTriggerData;

    @Column({ type: 'boolean', default: false, nullable: true })
    warning?: boolean;

    @Column({
        name: 'parent_process_instance_id',
        type: 'uuid',
        nullable: true,
    })
    parentProcessInstanceId?: string;
}
