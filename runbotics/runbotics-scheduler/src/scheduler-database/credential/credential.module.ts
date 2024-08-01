import { Module } from '@nestjs/common';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from './credential.entity';
import { UserModule } from '#/database/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Credential]), UserModule],
  controllers: [CredentialController],
  providers: [CredentialService],
  exports: [CredentialService]
})
export class CredentialModule {}
