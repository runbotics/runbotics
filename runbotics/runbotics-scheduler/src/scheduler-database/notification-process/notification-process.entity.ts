import { NotificationProcessType } from 'runbotics-common';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { User } from '#/scheduler-database/user/user.entity';


@Entity({ name: 'notification_process' })
@Unique(['email', 'user', 'process', 'type'])
export class NotificationProcess {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ enum: NotificationProcessType, default: NotificationProcessType.PROCESS_ERROR, type: 'varchar', length: 50 })
    type: NotificationProcessType;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', nullable: false, default: '', length: 256 })
    email: string;

    @ManyToOne(() => ProcessEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    getNotificationEmail(): string {
        if (!this.email) {
            return this.user.email;
        }

        return this.email;
    }
}
