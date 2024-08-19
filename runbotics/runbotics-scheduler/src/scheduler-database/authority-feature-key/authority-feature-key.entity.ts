import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { FeatureKey } from '../feature-key/feature-key.entity';
import { Role as RoleEnum } from 'runbotics-common';
import { Authority } from '../authority/authority.entity';
import { FeatureKey as FeatureKeyEnum } from 'runbotics-common';

@Entity({ name: 'authority_feature_key' })
export class AuthorityFeatureKey {
    @ManyToOne(() => Authority, { eager: true })
    @JoinColumn({ name: 'authority', referencedColumnName: 'name' })
    authorities: Authority[];

    @PrimaryColumn({ type: 'varchar', length: 50 })
    authority: RoleEnum;

    @ManyToOne(() => FeatureKey, { eager: true })
    @JoinColumn({ name: 'feature_key', referencedColumnName: 'name' })
    featureKeys: FeatureKey[];

    @PrimaryColumn({ name: 'feature_key', type: 'varchar', length: 50 })
    featureKey: FeatureKeyEnum;
}
