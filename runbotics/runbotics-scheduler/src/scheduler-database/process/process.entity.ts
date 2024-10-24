import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn, JoinTable, ManyToMany,
    ManyToOne, OneToMany, OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import {
    IBotCollection,
    IBotSystem,
    IScheduleProcess,
    IUser, NotificationProcess, ProcessCollection as IProcessCollection,
} from 'runbotics-common';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { ScheduleProcess } from '#/scheduler-database/schedule-process/schedule-process.entity';
import { UserEntity } from '#/database/user/user.entity';
import { BotCollectionEntity } from '#/database/bot-collection/bot-collection.entity';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';
import {
    NotificationProcess as NotificationProcessEntity,
} from '#/scheduler-database/notification-process/notification-process.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { ProcessCredential } from '#/scheduler-database/process-credential/process-credential.entity';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { ProcessOutput } from '#/scheduler-database/process-output/process-output.entity';

@Entity({ name: 'process' })
export class ProcessEntity {
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    @Generated()
    id: number;

    @Column({
        name: 'tenant_id',
        type: 'uuid',
        nullable: false,
        default: 'b7f9092f-5973-c781-08db-4d6e48f78e98',
    })
    tenantId: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column('text')
    description: string;

    @Column('text')
    definition: string;

    @CreateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone' })
    created: string;

    @UpdateDateColumn({ transformer: dateTransformer, type: 'timestamp without time zone' })
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

    @ManyToOne(() => ProcessOutput, processOutput => processOutput.processes)
    @JoinColumn({ name: 'output_type' })
    output: ProcessOutput;

    @Column({ name: 'output_type', type: 'varchar', length: 50, default: 'JSON' })
    outputType: string;

    @ManyToOne(() => BotSystem, system => system.processes)
    @JoinColumn({ name: 'system' })
    system: IBotSystem;

    @Column({ name: 'system', type: 'varchar', length: 50 })
    systemName: string;

    @OneToMany(() => ScheduleProcess, scheduleProcess => scheduleProcess.process)
    schedules: IScheduleProcess[];

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'created_by_id', referencedColumnName: 'id' })
    createdBy: IUser;

    @ManyToOne(() => BotCollectionEntity, { nullable: false })
    @JoinColumn({ name: 'bot_collection', referencedColumnName: 'id' })
    botCollection: IBotCollection;

    @Column({ name: 'bot_collection' })
    botCollectionId: string;

    @ManyToOne(() => ProcessCollectionEntity)
    @JoinColumn({ name: 'process_collection' })
    processCollection: IProcessCollection;

    @Column({ name: 'process_collection', nullable: true })
    processCollectionId: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'editor_id', referencedColumnName: 'id' })
    editor: IUser;

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

    @ManyToMany(() => Tag, tag => tag.processes, { eager: true })
    @JoinTable({
        name: 'tag_process',
        joinColumn: { name: 'process_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    })
    tags: Tag[];
}
