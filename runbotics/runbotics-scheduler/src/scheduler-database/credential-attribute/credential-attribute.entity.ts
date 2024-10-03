import { PrimaryColumn, Entity, Column, OneToOne, JoinColumn, OneToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, Unique } from 'typeorm';
import { Secret } from '#/scheduler-database/secret/secret.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity({ schema: 'scheduler' })
@Unique(['name', 'credentialId'])
export class CredentialAttribute {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name'  })
    name: string;

    @ManyToOne(() => Tenant)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @Column({ name: 'masked' })
    masked: boolean;

    @OneToOne(() => Secret, secret => secret.attribute, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'secret_id' })
    secret: Secret;

    @Column({ name: 'secret_id' })
    secretId: string;

    @ManyToOne(() => Credential, credential => credential.attributes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'credential_id' })
    credential: Credential;

    @Column({ name: 'credential_id' })
    credentialId: string;
}