import { dateTransformer } from '#/database/database.utils';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Authority } from '../authority/authority.entity';
import { IAuthority } from 'runbotics-common';
import { Tenant } from '../tenant/tenant.entity';
import { Credential } from '../credential/credential.entity';
import { CredentialCollectionUser } from '../credential-collection-user/credential-collection-user.entity';

@Entity({ name: 'jhi_user' })
export class User {
    login = 'login'; // TEMPORARY FOR COMPATIBILITY

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 191 })
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

    @Column({ type: 'boolean' })
    activated: boolean;

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


    @ManyToMany(() => Authority)
    @JoinTable({
        name: 'jhi_user_authority',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'authority_name', referencedColumnName: 'name' },
    })
        authorities: IAuthority[];

    @OneToMany(() => Tenant, tenant => tenant.createdByUser)
    tenants: Tenant[];

    @OneToMany(() => Credential, credential => credential.createdBy)
    createdCredentials: Credential[];

    @OneToMany(() => Credential, credential => credential.updatedBy)
    updatedCredentials: Credential[];

    @OneToMany(
        () => CredentialCollectionUser,
        (credentialCollectionUser) =>
            credentialCollectionUser.user,
    )
    credentialCollectionUser: CredentialCollectionUser[];
}
