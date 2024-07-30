import { Tenant } from '#/database/tenant/tenant.entity';
import { UserEntity } from '#/database/user/user.entity';
import { CredentialAttribute } from '#/scheduler-database/credential-attribute/credential-attribute.entity';
import { Secret } from '#/scheduler-database/secret/secret.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import { Collection, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'scheduler' })
export class CredentialCollection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @ManyToOne(() => Tenant, tenant => tenant.credentialCollections)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone'})
    createdAt: Date;

    @Column({ name: 'created_by_id' })
    createdById: number;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone'})
    updatedAt: Date;

    @Column({ name: 'updated_by_id' })
    updatedById: number;

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'credential_collection_user',
        joinColumn: { name: 'collection_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    })
    users: UserEntity[];

    // @OneToMany(() => Credential, credential => credential.collection)
    // @JoinColumn({ name: 'collection_id' })
    // credentials: Credential[];
}