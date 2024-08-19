import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityFeatureKey } from './authority-feature-key.entity';

@Module ({
    imports: [TypeOrmModule.forFeature([AuthorityFeatureKey])],
})

export class AuthorityFeatureKeyModule {}