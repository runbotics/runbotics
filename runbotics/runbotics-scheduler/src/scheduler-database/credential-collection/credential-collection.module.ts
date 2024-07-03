import { Module } from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import { CredentialCollectionController } from './credential-collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialCollection } from './credential-collection.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CredentialCollection])],
    controllers: [CredentialCollectionController],
    providers: [CredentialCollectionService],
})
export class CredentialCollectionModule {}
