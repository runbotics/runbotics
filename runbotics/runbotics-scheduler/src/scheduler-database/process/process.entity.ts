import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn, JoinTable, ManyToMany,
    ManyToOne, OneToMany, OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import {
    IBotCollection,
    IScheduleProcess,
    NotificationProcess, ProcessCollection as IProcessCollection,
    BotSystemType,
} from 'runbotics-common';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { ScheduleProcess } from '#/scheduler-database/schedule-process/schedule-process.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';
import {
    NotificationProcess as NotificationProcessEntity,
} from '#/scheduler-database/notification-process/notification-process.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { ProcessCredential } from '#/scheduler-database/process-credential/process-credential.entity';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { ProcessOutput } from '#/scheduler-database/process-output/process-output.entity';
import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';

@Entity({ name: 'process' })
export class ProcessEntity {
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    @Generated()
    id: number;

    @Column({
        name: 'tenant_id',
        type: 'uuid',
        nullable: false,
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    definition: string;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    created: string;

    @Column({ type: 'timestamp without time zone' })
    updated: string;

    @Column({ name: 'is_public' })
    isPublic: boolean;

    @Column({ name: 'is_attended', default: false, nullable: true })
    isAttended?: boolean;

    @Column({ name: 'is_triggerable', default: false, nullable: true })
    isTriggerable?: boolean;

    @Column({ name: 'last_run', transformer: dateTransformer, type: 'timestamp without time zone', nullable: true })
    lastRun?: string;

    @Column({ name: 'execution_info', type: 'text', nullable: true })
    executionInfo: string;

    @ManyToOne(
        () => ProcessOutput,
        processOutput => processOutput.processes,
        { onUpdate: 'CASCADE' },
    )
    @JoinColumn({ name: 'output_type' })
    output: ProcessOutput;

    @Column({ name: 'output_type', type: 'varchar', length: 50, default: 'JSON' })
    outputType: string;

    @ManyToOne(() => BotSystem, system => system.processes)
    @JoinColumn({ name: 'system' })
    system: BotSystem;

    @Column({ name: 'system', default: BotSystemType.ANY, length: 50 })
    systemName: BotSystemType;

    @OneToMany(() => ScheduleProcess, scheduleProcess => scheduleProcess.process)
    schedules: IScheduleProcess[];

    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by_id', referencedColumnName: 'id' })
    createdBy: User;

    @ManyToOne(() => BotCollection, { nullable: false })
    @JoinColumn({ name: 'bot_collection', referencedColumnName: 'id' })
    botCollection: IBotCollection;

    @Column({ name: 'bot_collection' })
    botCollectionId: string;

    @ManyToOne(
        () => ProcessCollectionEntity,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'process_collection' })
    processCollection: IProcessCollection;

    @Column({ name: 'process_collection', nullable: true })
    processCollectionId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'editor_id', referencedColumnName: 'id' })
    editor: User;

    @OneToOne(() => ProcessContext, processContext => processContext.process)
    context: ProcessContext | null;

    @ManyToMany(() => GlobalVariable)
    @JoinTable({
        name: 'process_global_variable',
        joinColumn: { name: 'process_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'global_variable_id', referencedColumnName: 'id' },
    })
    globalVariables: GlobalVariable[];

    @OneToMany(
        () => NotificationProcessEntity,
        (notificationProcess) => notificationProcess.process,
    )
    notifications: NotificationProcess[];

    @OneToMany(
        () => ProcessCredential,
        (processCredential) => processCredential.process,
    )
    processCredential: ProcessCredential[];

    @ManyToMany(
        () => Tag,
        tag => tag.processes,
        {
            eager: true,
            cascade: true,
            onDelete: 'CASCADE',
        },
    )
    @JoinTable({
        name: 'tag_process',
        joinColumn: { name: 'process_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    })
    tags: Tag[];
}
