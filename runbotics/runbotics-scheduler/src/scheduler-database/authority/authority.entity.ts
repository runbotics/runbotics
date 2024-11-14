import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { FeatureKey } from '../feature-key/feature-key.entity';
import { IFeatureKey, Role as RoleEnum } from 'runbotics-common';

@Entity({ name: 'jhi_authority' })
export class Authority {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    name: RoleEnum;

    @ManyToMany(() => FeatureKey, { eager: true })
    @JoinTable({
        name: 'authority_feature_key',
        joinColumn: { name: 'authority', referencedColumnName: 'name' },
        inverseJoinColumn: { name: 'feature_key', referencedColumnName: 'name' },
    })
        featureKeys: IFeatureKey[];
}
