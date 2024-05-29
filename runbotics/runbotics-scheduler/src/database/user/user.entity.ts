import { IAuthority, IUser } from 'runbotics-common';
import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { AuthorityEntity } from '../authority/authority.entity';
import { dateTransformer, numberTransformer } from '../database.utils';
import { Tenant } from '#/database/tenant/tenant.entity';

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

    @ManyToMany(() => AuthorityEntity)
    @JoinTable({
        name: 'jhi_user_authority',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'authority_name', referencedColumnName: 'name' }
    })
        authorities: IAuthority[];
    
    @ManyToOne(() => Tenant, tenant => tenant.createdBy)
    tenants: Tenant[];
}
