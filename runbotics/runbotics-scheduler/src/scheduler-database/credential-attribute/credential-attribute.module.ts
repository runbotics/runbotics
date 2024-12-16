import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialAttribute } from './credential-attribute.entity';

const repositories = TypeOrmModule.forFeature([CredentialAttribute]);

@Module({
    imports: [repositories],
    exports: [repositories],
})
export class CredentialAttributeModule {}
