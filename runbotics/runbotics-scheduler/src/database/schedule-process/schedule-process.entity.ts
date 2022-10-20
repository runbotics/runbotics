import { IScheduleProcess, IUser, IProcess } from 'runbotics-common';
import { Entity, Column, ManyToOne, JoinColumn, Generated, PrimaryColumn } from 'typeorm';
import { numberTransformer } from '../database.utils';
import { ProcessEntity } from '../process/process.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'schedule_process' })
export class ScheduleProcessEntity implements IScheduleProcess {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
        id: number;

    @Column()
        cron: string;

    @ManyToOne(() => ProcessEntity)
    @JoinColumn({ name: 'process_id', referencedColumnName: 'id' })
        process: IProcess;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
        user: IUser;

}