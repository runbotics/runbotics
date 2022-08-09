import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureKeyEntity } from './featureKey.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FeatureKeyEntity])],
    exports: [TypeOrmModule],
})
export class FeatureKeyModule {}
