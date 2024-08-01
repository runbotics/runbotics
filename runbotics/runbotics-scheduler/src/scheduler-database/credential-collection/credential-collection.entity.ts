import { Tenant } from '#/database/tenant/tenant.entity';
import { UserEntity } from '#/database/user/user.entity';
import { CredentialAttribute } from '#/scheduler-database/credential-attribute/credential-attribute.entity';
import { Secret } from '#/scheduler-database/secret/secret.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CredentialCollectionUser } from '../credential-collection-user/credential-collection-user.entity';

export enum AccessType {
    PRIVATE = 'PRIVATE',
    GROUP = 'GROUP',
}

export enum Color {
    ORANGE = 'ORANGE',
    YELLOW = 'YELLOW',
    BLUE = 'BLUE',
    GREEN = 'GREEN',
    RED = 'RED',
}

@Entity({ schema: 'scheduler', name: 'credential_collection' })
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

    @Column({ name: 'description', nullable: true, default: () => 'SET_NULL' })
    description: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp without time zone',
    })
    createdAt: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UserEntity;

    @Column({ name: 'created_by_id' })
    createdById: number;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp without time zone',
    })
    updatedAt: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: UserEntity;

    @Column({ name: 'updated_by_id' })
    updatedById: number;

    @OneToMany(
        () => CredentialCollectionUser,
        (credentialCollectionUser) =>
            credentialCollectionUser.credentialCollection,
        { cascade: true }
    )
    credentialCollectionUser: CredentialCollectionUser[];

    @OneToMany(() => Credential, (credential) => credential.collection)
    @JoinColumn({ name: 'collection_id' })
    credentials: Credential[];

    @Column('enum', { enum: AccessType, default: AccessType.PRIVATE })
    accessType: AccessType;

    @Column('enum', { enum: Color, default: Color.ORANGE })
    color: Color;
}
