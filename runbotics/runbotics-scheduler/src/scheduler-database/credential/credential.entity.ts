import { UserEntity } from '#/database/user/user.entity';
import { CredentialAttribute } from '#/scheduler-database/credential-attribute/credential-attribute.entity';
import {
    Column,
    CreateDateColumn,
    Entity, Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CredentialTemplate } from '../credential-template/credential-template.entity';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity({ schema: 'scheduler' })
@Unique(['collectionId', 'name', 'tenantId'])
export class Credential {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.credentials)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(
        () => CredentialCollection,
        (collection) => collection.credentials
    )
    @JoinColumn({ name: 'collection_id' })
    collection: CredentialCollection;

    @Column({ name: 'collection_id' })
    collectionId: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp without time zone',
    })
    createdAt: Date;

    @ManyToOne(() => UserEntity, user => user.createdCredentials)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UserEntity;

    @Column({ name: 'created_by_id' })
    createdById: number;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp without time zone',
    })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, user => user.updatedCredentials)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: UserEntity;

    @Column({ name: 'updated_by_id' })
    updatedById: number;

    @ManyToOne(
        () => CredentialTemplate,
        (credentialTemplate) => credentialTemplate.credentials
    )
    @JoinColumn({ name: 'template_id' })
    template: CredentialTemplate;

    @Column({ name: 'template_id' })
    templateId: string;

    @OneToMany(() => CredentialAttribute, attribute => attribute.credential, { cascade: true })
    attributes: CredentialAttribute[];
}
