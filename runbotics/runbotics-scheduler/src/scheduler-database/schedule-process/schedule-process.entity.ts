import { ProcessEntity } from '#/database/process/process.entity';
import { UserEntity } from '#/database/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


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

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user: UserEntity;
}
