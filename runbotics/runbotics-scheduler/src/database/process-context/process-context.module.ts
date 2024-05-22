import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '#/config/config.module';
import { ProcessContext } from '#/database/process-context/process-context.entity';
import { ProcessContextService } from '#/database/process-context/process-context.service';
import { SecretModule } from '#/database/secret/secret.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessContext]), SecretModule, ConfigModule],
    providers: [ProcessContextService],
    exports: [ProcessContextService],
})
export class ProcessContextModule {}
