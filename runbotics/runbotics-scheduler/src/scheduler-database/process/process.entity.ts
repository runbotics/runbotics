import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import {
    IBotCollection,
    IScheduleProcess,
    NotificationProcess,
    ProcessCollection as IProcessCollection,
    BotSystemType,
    DEFAULT_TENANT_ID,
} from 'runbotics-common';
import { BotSystem } from '#/scheduler-database/bot-system/bot-system.entity';
import { ScheduleProcess } from '#/scheduler-database/schedule-process/schedule-process.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { BotCollection } from '#/scheduler-database/bot-collection/bot-collection.entity';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';
import { NotificationProcess as NotificationProcessEntity } from '#/scheduler-database/notification-process/notification-process.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { ProcessCredential } from '#/scheduler-database/process-credential/process-credential.entity';
import { Tag } from '#/scheduler-database/tags/tag.entity';
import { ProcessOutput } from '#/scheduler-database/process-output/process-output.entity';
import { ProcessCollection } from '../process-collection/process-collection.entity';
import { ApiProperty } from '@nestjs/swagger';
import { WebhookProcessTrigger } from '#/webhook/entities/webhook-process-trigger.entity';

@Entity({ name: 'process' })
export class ProcessEntity {
    @ApiProperty({ example: 1 })
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    @Generated()
    id: number;

    @ApiProperty({ example: DEFAULT_TENANT_ID })
    @Column({
        name: 'tenant_id',
        type: 'uuid',
        nullable: false,
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @ApiProperty({ example: 'My Process' })
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ApiProperty({
        example: 'This process handles invoice parsing and archiving.',
    })
    @Column('text')
    description: string;

    @ApiProperty({
        example:
            '<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\n<bpmn2:definitions xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\""',
    })
    @Column('text')
    definition: string;

    @ApiProperty({ example: '2025-01-01T12:00:00.000Z' })
    @CreateDateColumn({ type: 'timestamp without time zone' })
    created: string;

    @ApiProperty({ example: '2025-01-02T14:30:00.000Z' })
    @Column({ type: 'timestamp without time zone' })
    updated: string;

    @ApiProperty({ example: true })
    @Column({ name: 'is_public' })
    isPublic: boolean;

    @ApiProperty({ example: false, required: false })
    @Column({ name: 'is_attended', default: false, nullable: true })
    isAttended?: boolean;

    @ApiProperty({ example: true, required: false })
    @Column({ name: 'is_triggerable', default: false, nullable: true })
    isTriggerable?: boolean;

    @ApiProperty({ example: '2025-01-03T15:00:00.000Z', nullable: true })
    @Column({
        name: 'last_run',
        transformer: dateTransformer,
        type: 'timestamp without time zone',
        nullable: true,
    })
    lastRun?: string;

    @ApiProperty({ example: 'Success', nullable: true })
    @Column({ name: 'execution_info', type: 'text', nullable: true })
    executionInfo: string;

    @ApiProperty({ type: () => ProcessOutput })
    @ManyToOne(() => ProcessOutput, (output) => output.processes, {
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'output_type' })
    output: ProcessOutput;

    @ApiProperty({ example: 'JSON' })
    @Column({
        name: 'output_type',
        type: 'varchar',
        length: 50,
        default: 'JSON',
    })
    outputType: string;

    @ApiProperty({ type: () => BotSystem })
    @ManyToOne(() => BotSystem, (system) => system.processes)
    @JoinColumn({ name: 'system' })
    system: BotSystem;

    @ApiProperty({ enum: BotSystemType, example: BotSystemType.WINDOWS })
    @Column({ name: 'system', default: BotSystemType.ANY, length: 50 })
    systemName: BotSystemType;

    @ApiProperty({ type: () => [ScheduleProcess] })
    @OneToMany(
        () => ScheduleProcess,
        (scheduleProcess) => scheduleProcess.process
    )
    schedules: IScheduleProcess[];

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'created_by_id', referencedColumnName: 'id' })
    createdBy: User;

    @ApiProperty({ type: () => BotCollection })
    @ManyToOne(() => BotCollection, { nullable: false })
    @JoinColumn({ name: 'bot_collection', referencedColumnName: 'id' })
    botCollection: IBotCollection;

    @ApiProperty({ example: '2e9b7f8e-a123-4e99-b847-7deed7bfb3ce' })
    @Column({ name: 'bot_collection' })
    botCollectionId: string;

    @ApiProperty({ type: () => ProcessCollection, nullable: true })
    @ManyToOne(() => ProcessCollection, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_collection' })
    processCollection: IProcessCollection;

    @ApiProperty({
        example: '91e785a3-20d4-4911-91d4-c15cf75c9c9f',
        nullable: true,
    })
    @Column({ name: 'process_collection', nullable: true })
    processCollectionId: string;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User)
    @JoinColumn({ name: 'editor_id', referencedColumnName: 'id' })
    editor: User;

    @ApiProperty({ type: () => ProcessContext, nullable: true })
    @OneToOne(() => ProcessContext, (processContext) => processContext.process)
    context: ProcessContext | null;

    @ApiProperty({ type: () => [GlobalVariable] })
    @ManyToMany(() => GlobalVariable)
    @JoinTable({
        name: 'process_global_variable',
        joinColumn: { name: 'process_id', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'global_variable_id',
            referencedColumnName: 'id',
        },
    })
    globalVariables: GlobalVariable[];

    @ApiProperty({ type: () => [NotificationProcessEntity] })
    @OneToMany(
        () => NotificationProcessEntity,
        (notificationProcess) => notificationProcess.process
    )
    notifications: NotificationProcess[];

    @ApiProperty({ type: () => [ProcessCredential] })
    @OneToMany(
        () => ProcessCredential,
        (processCredential) => processCredential.process
    )
    processCredential: ProcessCredential[];

    @ApiProperty({ type: () => [Tag] })
    @ManyToMany(() => Tag, (tag) => tag.processes, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'tag_process',
        joinColumn: { name: 'process_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    })
    tags: Tag[];

    @OneToMany(() => WebhookProcessTrigger, (trigger) => trigger.process)
    webhookTriggers: WebhookProcessTrigger[];
}
