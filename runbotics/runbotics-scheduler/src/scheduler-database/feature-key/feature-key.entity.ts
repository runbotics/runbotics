import { Entity, PrimaryColumn } from 'typeorm';
import { FeatureKey as FeatureKeyEnum } from 'runbotics-common';

@Entity({ name: 'feature_key' })
export class FeatureKey {
    @PrimaryColumn({ type: 'varchar', length: 50 })
    name: FeatureKeyEnum;
}
