import { PrimaryColumn, Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Tenant } from '../../database/tenant/tenant.entity';
import { Secret } from '#/scheduler-database/secret/secret.entity';
import { UserEntity } from '#/database/user/user.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import { CredentialTemplateAttributeType } from 'runbotics-common';

@Entity({ schema: 'scheduler' })
export class Attribute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name'  })
    name: string;

    @ManyToOne(() => Tenant, tenant => tenant.attributes)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'masked' })
    masked: boolean;

    @Column({ name: 'type '})
    type: CredentialTemplateAttributeType;

    @OneToOne(() => Secret, secret => secret.attribute, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'secret_id' })
    secret: Secret;

    @Column({ name: 'secret_id' })
    secretId: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone'})
    createdAt: Date;

    @ManyToOne(() => UserEntity, user => user.createdAttributes)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UserEntity;

    @Column({ name: 'created_by_id' })
    createdById: number;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone'})
    updatedAt: Date;

    @ManyToOne(() => UserEntity, user => user.updatedAttributes)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: UserEntity;

    @Column({ name: 'updated_by_id' })
    updatedById: number;

    @ManyToOne(() => Credential, credential => credential.attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'credential_id' })
    credential: Credential;

    @Column({ name: 'credential_id' })
    credentialId: string;
}