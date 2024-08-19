import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { FeatureKey } from '../feature-key/feature-key.entity';
import { Role as RoleEnum } from 'runbotics-common';

@Entity({ name: 'jhi_authority' })
export class Authority {
    @PrimaryColumn({ type: 'varchar', length: 50, enum: RoleEnum })
    name: RoleEnum;

    @OneToMany(() => FeatureKey, featureKey => featureKey.name, { eager: true })
    featureKeys: FeatureKey[];
}
