import { UserEntity } from '#/database/user/user.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CredentialCollectionUser } from '../credential-collection-user/credential-collection-user.entity';
import { Tenant } from '../tenant/tenant.entity';
import { dateTransformer, numberTransformer } from '#/database/database.utils';
import { AccessType, Color } from 'runbotics-common';

@Entity({ schema: 'scheduler', name: 'credential_collection' })
@Unique(['name', 'tenantId', 'createdById'])
export class CredentialCollection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name' })
    name: string;

    @ManyToOne(() => Tenant, (tenant) => tenant.credentialCollections)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant;

    @Column('uuid', { name: 'tenant_id' })
    tenantId: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp without time zone',
        transformer: dateTransformer,
    })
    createdAt: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UserEntity;

    @Column({ name: 'created_by_id', transformer: numberTransformer })
    createdById: number;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp without time zone',
        transformer: dateTransformer
    })
    updatedAt: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: UserEntity;

    @Column({ name: 'updated_by_id', transformer: numberTransformer  })
    updatedById: number;

    @OneToMany(() => CredentialCollectionUser, (credentialCollectionUser) => credentialCollectionUser.credentialCollection, { cascade: true })
    credentialCollectionUser: CredentialCollectionUser[];

    @OneToMany(() => Credential, (credential) => credential.collection)
    @JoinColumn({ name: 'collection_id' })
    credentials: Credential[];

    @Column('enum', { name: 'access_type', enum: AccessType, default: AccessType.PRIVATE })
    accessType: AccessType;

    @Column('enum', { enum: Color, default: Color.LIGHT_ORANGE })
    color: Color;
}