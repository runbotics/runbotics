import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Generated, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { IProcess, IScheduleProcess, IUser, IBotCollection, IBotSystem } from 'runbotics-common';
import { ScheduleProcessEntity } from '../schedule-process/schedule-process.entity';
import { BotCollectionEntity } from '../bot-collection/bot-collection.entity';
import { BotSystemEntity } from '../bot-system/bot-system.entity';
import { dateTransformer, numberTransformer } from '../database.utils';

@Entity({ name: 'process' })
export class ProcessEntity implements IProcess {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
        id: number;

    @Column({ unique: true })
        name: string;

    @Column()
        description: string;

    @Column()
        definition: string;

    @Column({ transformer: dateTransformer })
        created: string;

    @Column({ transformer: dateTransformer })
        updated: string;

    @Column({ name: 'is_public' })
        isPublic: boolean;

    @Column({ name: 'is_attended' })
        isAttended?: boolean;

    @Column({ name: 'is_triggerable' })
        isTriggerable?: boolean;

    @Column({ name: 'executions_count' })
        executionsCount: number;

    @Column({ name: 'failure_executions_count' })
        failureExecutionsCount: number;

    @Column({ name: 'success_executions_count' })
        successExecutionsCount: number;
    
    @Column({ name: 'execution_info' })
        executionInfo: string;

    @ManyToOne(() => BotSystemEntity)
    @JoinColumn([{ name: 'system', referencedColumnName: 'name' }])
        system: IBotSystem;

    @OneToMany(() => ScheduleProcessEntity, scheduleProcess => scheduleProcess.process)
        schedules: IScheduleProcess[];

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'created_by_id', referencedColumnName: 'id' })
        createdBy: IUser;

    @ManyToOne(() => BotCollectionEntity)
    @JoinColumn({ name: 'bot_collection', referencedColumnName: 'id' })
        botCollection: IBotCollection;
}