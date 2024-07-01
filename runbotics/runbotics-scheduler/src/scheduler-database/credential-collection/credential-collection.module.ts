import { Module } from '@nestjs/common';
import { CredentialCollectionService } from './credential-collection.service';
import { CredentialCollectionController } from './credential-collection.controller';

@Module({
  controllers: [CredentialCollectionController],
  providers: [CredentialCollectionService],
})
export class CredentialCollectionModule {}
