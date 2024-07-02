import { Tenant } from '#/database/tenant/tenant.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CredentialTemplateAttribute } from '../credential-template-attribute/credential-template-attribute.entity';
import { Credential } from '../credential/credential.entity';

@Entity()
export class CredentialTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', unique: true })
    name: string;

    @ManyToOne(() => Tenant, tenant => tenant.credentials)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column({ name: 'tenant_id', nullable: true})
    tenantId: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @OneToMany(() => CredentialTemplateAttribute, attribute => attribute.template, { cascade: true })
    attributes: CredentialTemplateAttribute[];

    @ManyToOne(() => Credential, credential => credential.template)
    credentials: Credential[];
}
