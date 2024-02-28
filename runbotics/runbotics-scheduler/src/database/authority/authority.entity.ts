import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Role, IAuthority } from 'runbotics-common';
import { IFeatureKey } from 'runbotics-common';
import { FeatureKeyEntity } from '../feature-key/feature-key.entity';

@Entity({ name: 'jhi_authority' })
export class AuthorityEntity implements IAuthority {
    @PrimaryColumn({ nullable: false, length: 50, enum: Role, type: 'varchar' })
        name: Role;
    @ManyToMany(() => FeatureKeyEntity, { eager: true })
    @JoinTable({
        name: 'authority_feature_key',
        joinColumn: { name: 'authority', referencedColumnName: 'name' },
        inverseJoinColumn: { name: 'feature_key', referencedColumnName: 'name' }
    })
        featureKeys: IFeatureKey[];
}
