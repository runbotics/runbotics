import { UserEntity } from '#/database/user/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';

export enum PrivilegeType {
    READ = 'READ',
    WRITE = 'WRITE',
}

@Entity({
    name: 'credential_collection_user',
    schema: 'scheduler',
    synchronize: false,
})
export class CredentialCollectionUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CredentialCollection, (collection) => collection, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'collection_id' })
    credentialCollection: CredentialCollection;

    @Column('uuid', { name: 'collection_id' })
    credentialCollectionId: string;

    @ManyToOne(() => UserEntity, (user) => user, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column('number', { name: 'user_id' })
    userId: number;

    @Column('enum', { enum: PrivilegeType, default: PrivilegeType.WRITE })
    privilegeType: PrivilegeType;
}
