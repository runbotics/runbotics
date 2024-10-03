import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Guest, IUser } from 'runbotics-common';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'guest', synchronize: false })
export class GuestEntity implements Guest {
    @PrimaryColumn({ name: 'ip_hash', type: 'varchar', length: 100 })
    ipHash: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: IUser;

    @Column({ name: 'executions_count', type: 'int' })
    executionsCount: number;
}
