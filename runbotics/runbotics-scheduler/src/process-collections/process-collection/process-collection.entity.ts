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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ schema: 'scheduler' })
@Tree('closure-table')
export class ProcessCollection {
    @ApiProperty({ description: 'Unique identifier for the collection', format: 'uuid' })
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;

    @ApiProperty({ description: 'Name of the process collection' })
    @Column()
    name: string;

    @ApiProperty({ description: 'Optional description of the collection', required: false })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ description: 'Date of creation', type: String, format: 'date-time' })
    @CreateDateColumn({ type: 'timestamp', transformer: dateTransformer })
    created: Date;

    @ApiProperty({ description: 'Date of last update', type: String, format: 'date-time' })
    @UpdateDateColumn({ type: 'timestamp', transformer: dateTransformer })
    updated: Date;

    @ApiProperty({ description: 'User who created the collection', required: false, type: () => User })
    @ManyToOne(() => User, (user) => user.createdProcessCollections, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
    createdBy?: User;

    @ApiProperty({ description: 'ID of the user who created the collection', required: false })
    @Column({ nullable: true })
    created_by: number;

    @ApiProperty({ description: 'Owner of the collection', required: false, type: () => User })
    @ManyToOne(() => User, (user) => user.ownedProcessCollections, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
    owner?: User;

    @ApiProperty({ description: 'ID of the collection owner', required: false })
    @Column({ name: 'owner_id', nullable: true })
    ownerId: number;

    @ApiProperty({ description: 'Whether the collection is publicly accessible' })
    @Column({ type: 'boolean', default: false })
    isPublic: boolean;

    @ApiProperty({ description: 'Tenant ID', format: 'uuid' })
    @Column({ name: 'tenant_id', type: 'uuid', default: DEFAULT_TENANT_ID })
    tenantId: string;

    @ApiProperty({ description: 'Tenant of the collection', type: () => Tenant })
    @ManyToOne(() => Tenant, () => {
    }, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
    tenant: Tenant;

    @ApiProperty({
        description: 'List of user privileges related to the collection',
        type: () => [ProcessCollectionUser],
    })
    @OneToMany(() => ProcessCollectionUser, (processCollectionUser) => processCollectionUser.processCollection)
    processCollectionPrivileges: ProcessCollectionUser[];

    @ApiProperty({
        description: 'Links related to this collection',
        type: () => [ProcessCollectionLink],
    })
    @OneToMany(() => ProcessCollectionLink, (processCollectionLink) => processCollectionLink.collection)
    processCollectionLinks: ProcessCollectionLink[];

    @ApiProperty({ description: 'Child collections in the tree', type: () => [ProcessCollection] })
    @TreeChildren({ cascade: true })
    children: ProcessCollection[];

    @ApiProperty({ description: 'Parent collection in the tree', type: () => ProcessCollection, required: false })
    @TreeParent({ onDelete: 'CASCADE' })
    parent?: ProcessCollection;

    @ApiProperty({ description: 'ID of the parent collection', required: false })
    @Column({ nullable: true })
    parentId?: string;
}
