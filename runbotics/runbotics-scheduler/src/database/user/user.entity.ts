import { IAuthority, IUser } from 'runbotics-common';
import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { AuthorityEntity } from '../authority/authority.entity';
import { dateTransformer, numberTransformer } from '../database.utils';

@Entity({ name: 'jhi_user' })
export class UserEntity implements IUser {
    @PrimaryColumn({ type: 'bigint', transformer: numberTransformer })
        id: number;

    @Column({ unique: true })
        login: string;

    @Column({ name: 'password_hash', select: false })
        passwordHash: string;

    @Column({ name: 'first_name' })
        firstName: string;

    @Column({ name: 'last_name' })
        lastName: string;

    @Column({ unique: true })
        email: string;

    @Column({ name: 'image_url' })
        imageUrl: string;

    @Column()
        activated: boolean;

    @Column({ name: 'lang_key' })
        langKey: string;

    @Column({ name: 'activation_key', select: false })
        activationKey: string;

    @Column({ name: 'reset_key', select: false })
        resetKey: string;

    @Column({ name: 'created_by' })
        createdBy: string;

    @Column({ name: 'created_date', transformer: dateTransformer })
        createdDate: string;

    @Column({ name: 'reset_date', transformer: dateTransformer })
        resetDate: string;

    @Column({ name: 'last_modified_by' })
        lastModifiedBy: string;

    @Column({ name: 'last_modified_date', transformer: dateTransformer })
        lastModifiedDate: string;

    @ManyToMany(() => AuthorityEntity)
    @JoinTable({
        name: 'jhi_user_authority',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'authority_name', referencedColumnName: 'name' }
    })
        authorities: IAuthority[];
}
