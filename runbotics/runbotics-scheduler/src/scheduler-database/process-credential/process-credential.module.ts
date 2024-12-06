import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCredential } from './process-credential.entity';
import { ProcessCredentialController } from './process-credential.controller';
import { ProcessCredentialService } from './process-credential.service';
import { ProcessModule } from '#/scheduler-database/process/process.module';
import { Credential } from '../credential/credential.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProcessCredential, Credential]), forwardRef(() => ProcessModule)],
    providers: [ProcessCredentialService],
    controllers: [ProcessCredentialController],
    exports: [ProcessCredentialService],
})
export class ProcessCredentialModule { }
