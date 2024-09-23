import {
    Column, CreateDateColumn,
    Entity, Generated, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '#/database/user/user.entity';

@Entity({ name: 'process' })
export class ProcessCollectionEntity {

    
    @Generated('uuid')
    @PrimaryColumn()
    id: string;

    @Column('varchar', { length: 255 })
    name: string;

    @Column('varchar', { length: 255 })
    description: string;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    created: string;

    @UpdateDateColumn({ type: 'timestamp without time zone' })
    updated: string;
    
    @Column()
    is_public: boolean;
    
    @ManyToOne(() => UserEntity, user => user.dupa)
    createdByUser: UserEntity;
    
    
}
