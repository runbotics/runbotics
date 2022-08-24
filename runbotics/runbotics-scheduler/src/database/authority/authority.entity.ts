import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Role, IAuthority } from 'runbotics-common';
import { IFeatureKey } from 'runbotics-common';
import { FeatureKeyEntity } from '../feature_key/featureKey.entity';

@Entity({ name: 'jhi_authority' })
export class AuthorityEntity implements IAuthority {
    @PrimaryColumn({ nullable: false, length: 50, enum: Role })
        name: Role;
    @ManyToMany(() => FeatureKeyEntity, { eager: true })
    @JoinTable({
        name: 'authority_feature_key',
        joinColumn: { name: 'authority', referencedColumnName: 'name' },
        inverseJoinColumn: { name: 'feature_key', referencedColumnName: 'name' }
    })
        featureKeys: IFeatureKey[];
}
