import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { User } from '#/scheduler-database/user/user.entity';


@Entity({ name: 'process_summary_notification_subscribers' })
@Unique(['customEmail', 'user', 'process'])
export class ProcessSummaryNotificationSubscribersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'varchar', nullable: true, default: '', length: 256, name: 'custom_email' })
    customEmail: string;

    @ManyToOne(() => ProcessEntity, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_id' })
    process: ProcessEntity;

    @Column()
    user_id: number;

    @Column()
    process_id: number;
}
