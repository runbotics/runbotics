import {
    Column, CreateDateColumn,
    Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '#/database/user/user.entity';
import { ProcessEntity } from '#/database/process/process.entity';

@Entity({ name: 'process_collection' })
export class ProcessCollectionEntity {
    @Generated('uuid')
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id', type: 'uuid', nullable: false, default: 'b7f9092f-5973-c781-08db-4d6e48f78e98' })
    tenantId: string;

    @ManyToOne(
        () => ProcessCollectionEntity,
        processCollection => processCollection.children,
        { nullable: true },
    )
    @JoinColumn({ name: 'parent_id' })
    parent: ProcessCollectionEntity | null;

    @OneToMany(
        () => ProcessCollectionEntity,
        processCollection => processCollection.parent,
    )
    children: ProcessCollectionEntity[];

    @Column('varchar', { length: 255 })
    name: string;

    @Column('varchar', { length: 255 })
    description: string;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    created: string;

    @UpdateDateColumn({ type: 'timestamp without time zone' })
    updated: string;

    @Column({ name: 'is_public' })
    isPublic: boolean;

    @ManyToOne(() => UserEntity, user => user.processCollections)
    @JoinColumn({ name: 'created_by' })
    createdByUser: UserEntity;

    @OneToMany(() => ProcessEntity, process => process.processCollection)
    processes: ProcessEntity[];

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'process_collection_user',
        joinColumn: { name: 'collection_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: UserEntity[];
}
