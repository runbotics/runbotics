import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from './authority.entity';

@Module ({
    imports: [TypeOrmModule.forFeature([Authority])],
})

export class AuthorityModule {}