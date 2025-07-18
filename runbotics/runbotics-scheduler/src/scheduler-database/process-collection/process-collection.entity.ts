import { DEFAULT_TENANT_ID } from '#/utils/tenant.utils';
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Tenant } from '../tenant/tenant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'process_collection' })
export class ProcessCollection {
    @ApiProperty()
    @PrimaryColumn({ type: 'uuid' })
    @Generated('uuid')
    id: string;
    
    @ApiProperty()
    @Column({
        type: 'varchar',
        length: 255,
    })
    name: string;
    
    @ApiProperty()
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    description?: string;
    
    @ApiProperty({ type: () => User, nullable: true})
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({
        name: 'created_by',
        referencedColumnName: 'id',
    })
    createdBy?: User;
    
    @ApiProperty()
    @Column({
        type: 'boolean',
        name: 'is_public',
    })
    isPublic: boolean;
    
    @ApiProperty()
    @Column({
        type: 'uuid',
        name: 'parent_id',
        nullable: true,
    })
    parentId?: string;
    
    @ApiProperty({type: () => ProcessCollection, nullable: true})
    @ManyToOne(() => ProcessCollection, { nullable: true })
    @JoinColumn({
        name: 'parent_id',
        referencedColumnName: 'id',
    })
    parent?: ProcessCollection;
    
    @ApiProperty()
    @Column({
        name: 'tenant_id',
        type: 'uuid',
        default: DEFAULT_TENANT_ID,
    })
    tenantId: string;
    
    @ApiProperty({type: () => Tenant})
    @ManyToOne(() => Tenant)
    @JoinColumn({
        name: 'tenant_id',
        referencedColumnName: 'id',
    })
    tenant: Tenant;
    
    @ApiProperty()
    @CreateDateColumn({ type: 'timestamp without time zone' })
    created: string;
    
    @ApiProperty()
    @UpdateDateColumn({ type: 'timestamp without time zone' })
    updated: string;
    
    @ApiProperty({ type: () => [User] })
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