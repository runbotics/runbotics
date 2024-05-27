import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Secret } from '#/database/secret/secret.entity';
import { SecretService } from '#/database/secret/secret.service';
import { ConfigModule } from '#/config/config.module';

@Module({
    imports: [TypeOrmModule.forFeature([Secret]), ConfigModule],
    providers: [SecretService],
    exports: [SecretService],
})
export class SecretModule {}
