// import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
// import { CredentialCollection } from '../credential-collection/credential-collection.entity';
// import { UserEntity } from '#/database/user/user.entity';

// @Entity({ name: 'credential_collection_user' })
// export class CredentialCollectionUser {
//     @PrimaryColumn({ type: 'uuid' })
//     credentialCollection: CredentialCollection;
//     @ManyToMany(() => CredentialCollection, { eager: true })
//     @JoinTable({
//         joinColumn: { name: 'credential_collection', referencedColumnName: 'id' },
//         inverseJoinColumn: { name: 'jhi_user', referencedColumnName: 'id' }
//     })
//         users: UserEntity[];
// }
