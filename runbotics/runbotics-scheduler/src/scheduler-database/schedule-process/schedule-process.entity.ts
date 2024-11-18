import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '#/scheduler-database/user/user.entity';

@Entity({ name: 'schedule_process' })
export class ScheduleProcess {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    cron: string;

    @Column({ name: 'input_variables', type: 'text', nullable: true })
    inputVariables: string;

    @Column({ name: 'process_id' })
    processId: number;

    @ManyToOne(() => ProcessEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'process_id', referencedColumnName: 'id' })
    process: ProcessEntity;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: User;
}
