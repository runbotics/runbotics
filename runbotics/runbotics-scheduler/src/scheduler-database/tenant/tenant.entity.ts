import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { UserEntity } from '#/database/user/user.entity';

import { Secret } from '../secret/secret.entity';
import { ProcessContextSecret } from '../process-context-secret/process-context-secret.entity';
import { ProcessContext } from '../process-context/process-context.entity';
import { CredentialAttribute } from '../credential-attribute/credential-attribute.entity';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';
import { Credential } from '../credential/credential.entity';

@Entity()
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    name: string;

    @ManyToOne(() => UserEntity, user => user.tenants)
    @JoinColumn({ name: 'created_by' })
    createdByUser: UserEntity;

    @Column({ name: 'created_by' })
    createdBy: number;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;

    @Column({ type: 'varchar', name: 'last_modified_by', length: 50, nullable: true })
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

    @OneToMany(() => CredentialCollection, credentialCollection => credentialCollection.tenant)
    credentialCollections: CredentialCollection[];
}
