import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialCollectionUser } from './credential-collection-user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CredentialCollectionUser])],
})
export class CredentialCollectionUserModule {}
