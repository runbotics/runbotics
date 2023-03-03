import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureKeyEntity } from './feature-key.entity';

@Module({
    imports: [TypeOrmModule.forFeature([FeatureKeyEntity])]
})
export class FeatureKeyModule {}
