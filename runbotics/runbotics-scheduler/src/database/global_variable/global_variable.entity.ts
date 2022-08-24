import { GlobalVariableType, IGlobalVariable } from 'runbotics-common';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { dateTransformer } from '../database.utils';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'global_variable' })
export class GlobalVariableEntity implements IGlobalVariable {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        description: string;

    @Column({ name: 'last_modified', transformer: dateTransformer })
        lastModified: string;

    @Column()
        name: string;

    @Column()
        type: GlobalVariableType;

    @Column()
        value: string;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'user_id' })
        user: UserEntity;

}