import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    Tree,
    TreeChildren,
    TreeParent,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '#/scheduler-database/user/user.entity';
import { dateTransformer } from '#/database/database.utils';
import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { ProcessCollectionUser } from '../process-collection-user/process-collection-user.entity';
import { ProcessCollectionLink } from '../process-collection-link/process-collection-link.entity';

@Entity({ schema: 'scheduler' })
@Tree('closure-table')
export class ProcessCollection {
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ type: 'timestamp', transformer: dateTransformer })
    created: Date;

    @UpdateDateColumn({ type: 'timestamp', transformer: dateTransformer })
    updated: Date;

    @ManyToOne(() => User, (user) => user.createdProcessCollections, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'created_by',
        referencedColumnName: 'id',
    })
    createdBy?: User;

    @Column({ nullable: true })
    created_by: number;

    @ManyToOne(() => User, (user) => user.ownedProcessCollections, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'owner_id',
        referencedColumnName: 'id',
    })
    owner?: User;

    @Column({ name: 'owner_id', nullable: true })
    ownerId: number;

    @Column({ type: 'boolean', default: false })
    isPublic: boolean;

    @Column({
        name: 'tenant_id',
        type: 'uuid',
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;

    @ManyToOne(() => Tenant, () => {
    }, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'tenant_id',
        referencedColumnName: 'id',
    })
    tenant: Tenant;

    @OneToMany(
        () => ProcessCollectionUser,
        (processCollectionUser) => processCollectionUser.processCollection,
    )
    processCollectionPrivileges: ProcessCollectionUser[];

    @OneToMany(
        () => ProcessCollectionLink,
        processCollectionLink => processCollectionLink.collection,
    )
    processCollectionLinks: ProcessCollectionLink[];

    @TreeChildren({ cascade: true })
    children: ProcessCollection[];

    @TreeParent({ onDelete: 'CASCADE' })
    parent?: ProcessCollection;
    
    @Column({ nullable: true })
    parentId?: string;
}
