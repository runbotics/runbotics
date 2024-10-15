import { FeatureKey, IAuthority, IUser } from 'runbotics-common';
import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { dateTransformer, numberTransformer } from '../database.utils';
import { Tenant } from '#/scheduler-database/tenant/tenant.entity';
import { Credential } from '#/scheduler-database/credential/credential.entity';
import { CredentialCollectionUser } from '#/scheduler-database/credential-collection-user/credential-collection-user.entity';
import { Authority } from '#/scheduler-database/authority/authority.entity';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
@Entity({ name: 'jhi_user', synchronize: false })
export class UserEntity implements IUser {
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
        id: number;

    @Column({ unique: true, type: 'varchar' })
        login: string;

    @Column({ name: 'password_hash', select: false, type: 'varchar' })
        passwordHash: string;

    @Column({ name: 'first_name', type: 'varchar' })
        firstName: string;

    @Column({ name: 'last_name', type: 'varchar' })
        lastName: string;

    @Column({ unique: true, type: 'varchar'  })
        email: string;

    @Column({ name: 'image_url', type: 'varchar'  })
        imageUrl: string;

    @Column({type: 'boolean'} )
        activated: boolean;

    @Column({ name: 'lang_key', type: 'varchar'  })
        langKey: string;

    @Column({ name: 'activation_key', select: false, type: 'varchar'  })
        activationKey: string;

    @Column({ name: 'reset_key', select: false, type: 'varchar'  })
        resetKey: string;

    @Column({ name: 'created_by', type: 'varchar'  })
        createdBy: string;

    @Column({ name: 'created_date', transformer: dateTransformer, type: 'varchar'  })
        createdDate: string;

    @Column({ name: 'reset_date', transformer: dateTransformer, type: 'varchar'  })
        resetDate: string;

    @Column({ name: 'last_modified_by', type: 'varchar'  })
        lastModifiedBy: string;

    @Column({ name: 'last_modified_date', transformer: dateTransformer, type: 'varchar'  })
        lastModifiedDate: string;

    @ManyToMany(() => Authority)
    @JoinTable({
        name: 'jhi_user_authority',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'authority_name', referencedColumnName: 'name' },
    })
        authorities: IAuthority[];

    @OneToMany(() => Tenant, tenant => tenant.createdByUser)
    tenants: Tenant[];

    @Column({ type: 'varchar', name: 'tenant_id' })
    tenantId: string;

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

    @OneToMany(
        () => ProcessCollectionEntity,
        processCollection =>
            processCollection.createdByUser,
    )
    processCollections: ProcessCollectionEntity[];
    
    hasFeatureKey(featureKey: FeatureKey){
        const userKeys = this.authorities
            .flatMap((auth) => auth.featureKeys)
            .map((featureKey) => featureKey.name);

        return userKeys.includes(featureKey);
    }
}
