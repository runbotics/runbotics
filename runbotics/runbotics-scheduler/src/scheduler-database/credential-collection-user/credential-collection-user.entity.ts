import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
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
    @ManyToOne(
        () => CredentialCollection,
        (collection) => collection.credentialCollectionUser,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'collection_id' })
    credentialCollection: CredentialCollection;

    @PrimaryColumn({ name: 'collection_id', type: 'uuid' })
    credentialCollectionId: string;

    @ManyToOne(
        () => User,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'user_id' })
    user: User;

    @PrimaryColumn({ name: 'user_id', type: 'bigint', transformer: numberTransformer })
    userId: number;

    @Column({ name: 'privilege_type', type: 'enum', enum: PrivilegeType, default: PrivilegeType.WRITE })
    privilegeType: PrivilegeType;
}
