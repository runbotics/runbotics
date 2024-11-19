import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CredentialCollection } from '../credential-collection/credential-collection.entity';
import { numberTransformer } from '#/database/database.utils';
import { PrivilegeType } from 'runbotics-common';
import { User } from '../user/user.entity';

@Entity({
    name: 'credential_collection_user',
    schema: 'scheduler',
})
export class CredentialCollectionUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => CredentialCollection, (collection) => collection.credentialCollectionUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'collection_id' })
    credentialCollection: CredentialCollection;

    @Column({ name: 'collection_id', type: 'uuid' })
    credentialCollectionId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'bigint', transformer: numberTransformer })
    userId: number;

    @Column({ name: 'privilege_type', type: 'enum', enum: PrivilegeType, default: PrivilegeType.WRITE })
    privilegeType: PrivilegeType;
}
