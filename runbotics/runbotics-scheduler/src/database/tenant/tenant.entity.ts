import { PrimaryColumn, Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';
import { Secret } from '#/scheduler-database/secret/secret.entity';
import { ProcessContextSecret } from '#/scheduler-database/process-context-secret/process-context-secret.entity';
import { ProcessContext } from '#/scheduler-database/process-context/process-context.entity';
import { CredentialAttribute } from '#/scheduler-database/credential-attribute/credential-attribute.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import { CredentialCollection } from '#/scheduler-database/credential-collection/credential-collection.entity';

@Entity({ synchronize: false })
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

    @OneToMany(() => CredentialAttribute, attribute => attribute.tenant)
    attributes: CredentialAttribute[];

    @OneToMany(() => Credential, credential => credential.tenant)
    credentials: Credential[];

    @OneToMany(
        () => CredentialCollection,
        credentialCollection =>
            credentialCollection.tenant,
    )
    credentialCollections: CredentialCollection[];

    @OneToMany(() => UserEntity, user => user.tenant)
    users: UserEntity[];
}
