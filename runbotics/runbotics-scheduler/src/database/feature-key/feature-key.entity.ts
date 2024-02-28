import { IFeatureKey, FeatureKey } from 'runbotics-common';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'feature_key' })
export class FeatureKeyEntity implements IFeatureKey {
    @PrimaryColumn({ name: 'name', nullable: false, length: 50, enum: FeatureKey, type: 'varchar' })
        name: FeatureKey;
}
