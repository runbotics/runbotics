import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Guest } from 'runbotics-common';

@Entity({ name: 'guest' })
export class GuestEntity implements Guest {
    @PrimaryColumn({ name: 'ip', type: 'varchar', length: 100 })
        ip: string;

    @Column({ name: 'user_id', type: 'bigint'})
        userId: number;

    @Column({ name: 'executions_count', type: 'int' })
        executionCount: number;
}
