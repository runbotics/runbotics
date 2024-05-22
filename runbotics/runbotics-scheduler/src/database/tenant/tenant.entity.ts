import { PrimaryColumn, Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';
import { Secret } from '#/database/secret/secret.entity';
import { ProcessContextSecret } from '#/database/process-context-secret/process-context-secret.entity';
import { ProcessContext } from '#/database/process-context/process-context.entity';

@Entity()
export class Tenant {
    @PrimaryColumn({ type: 'uuid', generated: 'uuid' })
    id: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    name: string;

    @ManyToOne(() => UserEntity, user => user.tenants)
    @JoinColumn({ name: 'created_by' })
    createdBy: UserEntity;

    @Column({ type: 'bigint', name: 'created_by' })
    createdById: number;

    @Column('timestamp with time zone')
    created: Date;

    @Column('timestamp with time zone')
    updated: Date;

    @Column({ type: 'varchar', name: 'last_modified_by', length: 50 })
    lastModifiedBy: string;

    @OneToMany(() => Secret, secret => secret.tenant)
    secrets: Secret[];

    @OneToMany(() => ProcessContextSecret, secret => secret.tenant)
    processContextSecrets: ProcessContextSecret[];

    @OneToMany(() => ProcessContext, processContext => processContext.tenant)
    processContexts: ProcessContext[];
}
