import { NotificationProcessType } from 'runbotics-common';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ProcessEntity } from '#/database/process/process.entity';
import { UserEntity } from '#/database/user/user.entity';


@Entity({ name: 'notification_process' })
@Unique(['user', 'process', 'type'])
export class NotificationProcess {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ enum: NotificationProcessType, default: NotificationProcessType.PROCESS_ERROR, type: 'varchar', length: 50 })
    type: NotificationProcessType;

    @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => ProcessEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;
}