import { BotEntity } from '#/database/bot/bot.entity';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import { UserEntity } from '#/database/user/user.entity';
import {
    EmailTriggerData,
    ProcessInstanceStatus,
    TriggerEvent,
    UserTriggerData,
} from 'runbotics-common';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcessEntity } from '../process/process.entity';

@Entity({ name: 'process_instance' })
export class ProcessInstance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'time without time zone', transformer: dateTransformer })
    created: string;

    @Column({ type: 'text', nullable: true })
    input?: string;

    @Column({ type: 'text', nullable: true })
    output?: string;

    @Column({ type: 'character varying', length: 255 })
    status: ProcessInstanceStatus;

    @Column({ type: 'time without time zone', transformer: dateTransformer })
    updated: string;

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

    @Column({
        name: 'process_id',
        type: 'bigint',
        transformer: numberTransformer,
    })
    processId: ProcessEntity['id'];

    @ManyToOne(() => ProcessEntity, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @Column({
        name: 'orchestrator_process_instance_id',
        type: 'uuid',
        nullable: true,
    })
    orchestratorProcessInstanceId?: string;

    @Column({ type: 'character varying', length: 255, nullable: true })
    step?: string;

    @Column({ name: 'root_process_instance_id', type: 'uuid', nullable: true })
    rootProcessInstanceId?: string;

    @Column({
        name: 'user_id',
        type: 'bigint',
        transformer: numberTransformer,
        default: 1,
    })
    userId: UserEntity['id'];

    @ManyToOne(() => UserEntity, {
        onDelete: 'DEFAULT',
    })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column({ type: 'text', nullable: true })
    error?: string;

    @Column({ type: 'character varying', length: 255 })
    trigger: TriggerEvent;

    @Column({ name: 'trigger_data', type: 'jsonb', nullable: true })
    triggerData?: EmailTriggerData | UserTriggerData;

    @Column({ type: 'boolean', default: false })
    warning?: boolean;

    @Column({
        name: 'parent_process_instance_id',
        type: 'uuid',
        nullable: true,
    })
    parentProcessInstanceId?: string;
}
