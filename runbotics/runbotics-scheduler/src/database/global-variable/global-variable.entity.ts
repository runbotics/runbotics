import { GlobalVariableType, IGlobalVariable } from 'runbotics-common';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, Generated } from 'typeorm';
import { dateTransformer, numberTransformer } from '../database.utils';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'global_variable', synchronize: false })
export class GlobalVariableEntity implements IGlobalVariable {
    @Generated()
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
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
