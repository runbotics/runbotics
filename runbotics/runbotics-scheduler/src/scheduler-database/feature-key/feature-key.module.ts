import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureKey } from './feature-key.entity';

@Module ({
    imports: [TypeOrmModule.forFeature([FeatureKey])],
})

export class FeatureKeyModule {}
