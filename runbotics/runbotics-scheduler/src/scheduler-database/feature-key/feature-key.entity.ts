import { Entity, PrimaryColumn } from 'typeorm';
import { FeatureKey as FeatureKeyEnum } from 'runbotics-common';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'feature_key' })
export class FeatureKey {
    @ApiProperty({
        description: 'Unique feature key name that identifies specific functionality or permission',
        example: 'PROCESS_READ',
        enum: FeatureKeyEnum,
        enumName: 'FeatureKeyEnum'
    })
    @PrimaryColumn({ type: 'varchar', length: 50 })
    name: FeatureKeyEnum;
}