import { IScheduleProcess, IUser, IProcess } from 'runbotics-common';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProcessEntity } from '../process/process.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'schedule_process' })
export class ScheduleProcessEntity implements IScheduleProcess {
    @PrimaryGeneratedColumn({ type: 'bigint' })
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