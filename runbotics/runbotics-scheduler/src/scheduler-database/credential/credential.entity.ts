import { Tenant } from '#/database/tenant/tenant.entity';
import { UserEntity } from '#/database/user/user.entity';
import { Attribute } from '#/scheduler-database/attribute/attribute.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CredentialTemplate } from '../credential-template/credential-template.entity';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';

@Entity({ schema: 'scheduler' })
export class Credential {
    @PrimaryGeneratedColumn('uuid')a;
    id: string;

    @Column({ name: 'name' })
    name: string;

    @ManyToOne(() => Tenant, tenant => tenant.credentials)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @ManyToOne(() => CredentialCollection, collection => collection.credentials)
    @JoinColumn({ name: 'collection_id' })
    collection: CredentialCollection;

    @Column({ name: 'collection_id' })
    collectionId: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone'})
    createdAt: Date;

    @ManyToOne(() => UserEntity)
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

    @ManyToOne(() => CredentialTemplate, credentialTemplate => credentialTemplate.credentials)
    @JoinColumn({ name: 'template_id' })
    template: CredentialTemplate;

    @OneToMany(() => Attribute, attribute => attribute.credential)
    @JoinColumn({ name: 'credential_id' })
    attributes: Attribute[];
}