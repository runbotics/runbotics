import { Tenant } from '#/database/tenant/tenant.entity';
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
    })
    createdAt: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: UserEntity;

    @Column({ name: 'created_by_id' })
    createdById: number;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp without time zone',
    })
    updatedAt: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: UserEntity;

    @Column({ name: 'updated_by_id' })
    updatedById: number;

    @OneToMany(() => CredentialCollectionUser, (credentialCollectionUser) => credentialCollectionUser.credentialCollection, { cascade: true })
    credentialCollectionUser: CredentialCollectionUser[];

    @OneToMany(() => Credential, (credential) => credential.collection)
    @JoinColumn({ name: 'collection_id' })
    credentials: Credential[];

    @Column('enum', { name: 'access_type', enum: AccessType, default: AccessType.PRIVATE })
    accessType: AccessType;

    @Column('enum', { enum: Color, default: Color.ORANGE })
    color: Color;
}