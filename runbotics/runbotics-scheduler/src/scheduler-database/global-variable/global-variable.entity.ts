import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { GlobalVariableType } from 'runbotics-common';

import { UserEntity } from '#/database/user/user.entity';

import { Tenant } from '../tenant/tenant.entity';

@Entity({ name: 'global_variable' })
@Unique(['name', 'tenantId'])
export class GlobalVariable {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    type: GlobalVariableType;

    @Column({ type: 'text' })
    value: string;

    @UpdateDateColumn({ name: 'last_modified' })
    lastModified: Date;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({ name: 'creator_id' })
    creator: UserEntity;

    @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId: string;

    @ManyToOne(() => Tenant, tenant => tenant.id, { nullable: false })
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;
}