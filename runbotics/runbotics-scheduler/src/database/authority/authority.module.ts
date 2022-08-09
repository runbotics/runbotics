import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityEntity } from './authority.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AuthorityEntity])],
    exports: [TypeOrmModule],
})
export class AuthorityModule {}
