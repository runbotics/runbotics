import { Module } from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import { CredentialCollectionController } from './credential-collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialCollection } from './credential-collection.entity';
import { CredentialCollectionUserModule } from '../credential-collection-user/credential-collection-user.module';
import { UserModule } from '#/database/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([CredentialCollection]), CredentialCollectionUserModule, UserModule],
    controllers: [CredentialCollectionController],
    providers: [CredentialCollectionService],
})
export class CredentialCollectionModule {}
