import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';

import { Secret } from '../secret/secret.entity';
import { ProcessContextSecret } from '../process-context-secret/process-context-secret.entity';
import { ProcessContext } from '../process-context/process-context.entity';

@Entity({ schema: 'public' })
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    name: string;

    @Column({ type: 'bigint', name: 'created_by' })
    createdById: number;

    @ManyToOne(() => UserEntity, user => user.tenants)
    @JoinColumn({ name: 'created_by' })
    createdBy: UserEntity;

    @Column('timestamp with time zone')
    created: Date;

    @Column('timestamp with time zone')
    updated: Date;

    @Column({ type: 'varchar', name: 'last_modified_by' })
    lastModifiedBy: string;

    @OneToMany(() => Secret, secret => secret.tenant)
    secrets: Secret[];

    @OneToMany(() => ProcessContextSecret, secret => secret.tenant)
    processContextSecrets: ProcessContextSecret[];

    @OneToMany(() => ProcessContext, processContext => processContext.tenant)
    processContexts: ProcessContext[];
}
