import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity({ name: 'process_collection' })
export class ProcessCollection {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    description?: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({
        name: 'created_by',
        referencedColumnName: 'id',
    })
    createdBy?: User;

    @Column({
        type: 'boolean',
        name: 'is_public',
    })
    isPublic: boolean;

    @Column({
        type: 'uuid',
        name: 'parent_id',
        nullable: true,
    })
    parentId?: string;

    @ManyToOne(() => ProcessCollection, { nullable: true })
    @JoinColumn({
        name: 'parent_id',
        referencedColumnName: 'id',
    })
    parent?: ProcessCollection;

    @Column({
        name: 'tenant_id',
        type: 'uuid',
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({
        name: 'tenant_id',
        referencedColumnName: 'id',
    })
    tenant: Tenant;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    created: string;

    @UpdateDateColumn({ type: 'timestamp without time zone' })
    updated: string;

    @ManyToMany(
        () => User,
        {
            eager: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    )
    @JoinTable({
        name: 'process_collection_user',
        joinColumn: { name: 'collection_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: User[];
}