import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    Generated,
    PrimaryColumn,
    ManyToMany,
    JoinTable, OneToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import {
    IProcess,
    IScheduleProcess,
    IUser,
    IBotCollection,
    IBotSystem,
    NotificationProcess,
} from 'runbotics-common';
import { BotCollectionEntity } from '../bot-collection/bot-collection.entity';
import { BotSystemEntity } from '../bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '../database.utils';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';
import { GlobalVariable } from '#/scheduler-database/global-variable/global-variable.entity';
import { NotificationProcess as NotificationProcessEntity } from '#/scheduler-database/notification-process/notification-process.entity';
import { ScheduleProcess } from '#/scheduler-database/schedule-process/schedule-process.entity';
import { ProcessCredential } from '#/scheduler-database/process-credential/process-credential.entity';

@Entity({ name: 'process', synchronize: false })
export class ProcessEntity implements IProcess {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
    id: number;

    @Column({ name: 'tenant_id' })
    tenantId: string;

    @Column({ unique: true, type: 'varchar' })
    name: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'varchar' })
    definition: string;

    @Column({ transformer: dateTransformer, type: 'varchar' })
    created: string;

    @Column({ transformer: dateTransformer, type: 'varchar' })
    updated: string;

    @Column({ name: 'is_public', type: 'boolean' })
    isPublic: boolean;

    @Column({ name: 'is_attended', type: 'boolean' })
    isAttended?: boolean;

    @Column({ name: 'is_triggerable', type: 'boolean' })
    isTriggerable?: boolean;

    @Column({ name: 'last_run', type: 'varchar' })
    lastRun?: string;

    @Column({ name: 'execution_info', type: 'varchar' })
    executionInfo: string;

    @ManyToOne(() => BotSystemEntity)
    @JoinColumn([{ name: 'system', referencedColumnName: 'name' }])
    system: IBotSystem;

    @OneToMany(() => ScheduleProcess, scheduleProcess => scheduleProcess.process)
    schedules: IScheduleProcess[];

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'created_by_id', referencedColumnName: 'id' })
    createdBy: IUser;

    @ManyToOne(() => BotCollectionEntity)
    @JoinColumn({ name: 'bot_collection', referencedColumnName: 'id' })
    botCollection: IBotCollection;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'editor_id', referencedColumnName: 'id' })
    editor: IUser;

    @OneToOne(() => ProcessContext, processContext => processContext.process)
    context: ProcessContext | null;

    @ManyToMany(() => GlobalVariable)
    @JoinTable({
        name: 'process_global_variable',
        joinColumn: { name: 'process_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'global_variable_id', referencedColumnName: 'id' }
    })
    globalVariables: GlobalVariable[];

    @OneToMany(
        () => NotificationProcessEntity,
        (notificationProcess) => notificationProcess.process
    )
    notifications: NotificationProcess[];

    @OneToMany(
        () => ProcessCredential,
        (processCredential) => processCredential.process
    )
    processCredential: ProcessCredential[];
}
