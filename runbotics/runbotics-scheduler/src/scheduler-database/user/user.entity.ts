import { dateTransformer, numberTransformer } from '#/database/database.utils';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Authority } from '../authority/authority.entity';
import { IAuthority } from 'runbotics-common';
import { Tenant } from '../tenant/tenant.entity';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';

@Entity({ name: 'jhi_user', schema: 'public' })
export class User {
    @PrimaryColumn({
        type: 'bigint',
        transformer: numberTransformer,
        default: () => 'nextval(\'sequence_generator\')',
    })
    id: number;

    @Column({ type: 'varchar', length: 191, unique: true })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', select: false, length: 60 })
    passwordHash: string;

    @Column({ name: 'first_name', type: 'varchar', length: 50, nullable: true })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 50, nullable: true })
    lastName: string;

    @Column({ name: 'image_url', type: 'varchar', length: 256, nullable: true })
    imageUrl: string;

    @Column({ name: 'lang_key', type: 'varchar', length: 10, default: 'en' })
    langKey: string;

    @Column({ name: 'tenant_id', type: 'uuid', default: 'b7f9092f-5973-c781-08db-4d6e48f78e98' })
    tenantId: string;

    @ManyToOne(() => Tenant, { eager: true })
    @JoinColumn({ name: 'tenant_id', referencedColumnName: 'id' })
    tenant: Tenant;

    @Column({ type: 'boolean' })
    activated: boolean;

    @Column({
        name: 'has_been_activated',
        type: 'boolean',
        default: false,
    })
    hasBeenActivated: boolean;

    @Column({ name: 'activation_key', type: 'varchar', select: false, length: 20, nullable: true })
    activationKey: string;

    @Column({ name: 'reset_key', type: 'varchar', select: false, length: 20, nullable: true })
    resetKey: string;

    @Column({ name: 'created_by', type: 'varchar', length: 50 })
    createdBy: string;

    @Column({ name: 'reset_date', type: 'timestamp', transformer: dateTransformer, nullable: true })
    resetDate: string;

    @CreateDateColumn({ name: 'created_date', type: 'timestamp', transformer: dateTransformer })
    createdDate: string;

    @UpdateDateColumn({ name: 'last_modified_date', type: 'timestamp', transformer: dateTransformer })
    lastModifiedDate: string;

    @Column({ name: 'last_modified_by', type: 'varchar', length: 50 })
    lastModifiedBy: string;

    @ManyToMany(
        () => Authority,
        {
            eager: true,
            onDelete: 'CASCADE',
        },
    )
    @JoinTable({
        name: 'jhi_user_authority',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'authority_name', referencedColumnName: 'name' },
    })
    authorities: IAuthority[];

    @OneToMany(() => ProcessCollection, (processCollection) => processCollection.createdBy)
    createdProcessCollections: ProcessCollection[];

    @OneToMany(() => ProcessCollection, (processCollection) => processCollection.owner)
    ownedProcessCollections: ProcessCollection[];
    
    @OneToMany(() => ProcessCollectionUser, (processCollectionUser) => processCollectionUser.processCollection)
    processCollectionPrivileges: ProcessCollectionUser[];

    @OneToMany(() => ProcessCollectionLink, (processCollectionUser) => processCollectionUser.user)
    sharedCollections: ProcessCollectionLink[];
}
