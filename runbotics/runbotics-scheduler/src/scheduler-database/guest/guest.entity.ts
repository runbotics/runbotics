import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '#/scheduler-database/user/user.entity';

@Entity({ name: 'guest' })
export class Guest {
    @PrimaryColumn({ name: 'ip_hash', type: 'varchar', length: 100 })
    ipHash: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @Column({ name: 'executions_count', type: 'int' })
    executionsCount: number;
}
