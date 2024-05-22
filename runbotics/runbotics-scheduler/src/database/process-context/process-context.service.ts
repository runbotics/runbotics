import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessContext } from '#/database/process-context/process-context.entity';
import {
    DecryptedProcessContextDto,
    DecryptedProcessContextDtoSecret,
} from '#/database/process-context/dto/decrypted-process-context.dto';
import { SecretService } from '#/database/secret/secret.service';
// import { Secret } from '#/database/secret/secret.entity';
// import { ProcessContextSecret } from '#/database/process-context-secret/process-context-secret.entity';
// import * as util from 'util';

@Injectable()
export class ProcessContextService implements OnModuleInit {
    
    constructor(
        @InjectRepository(ProcessContext)
        private readonly processContextRepository: Repository<ProcessContext>,
        private readonly secretService: SecretService,
    ) {
    }

    async onModuleInit() {
        // example
        
        // const secret = this.secretService.encrypt('dupa', 'b7f9092f-5973-c781-08db-4d6e48f78e98');
        // await this.processContextRepository.manager.save(Secret, secret);
        // const ctx = new ProcessContext();
        // ctx.processId = 1001;
        // ctx.tenantId = 'b7f9092f-5973-c781-08db-4d6e48f78e98';
        // await this.processContextRepository.save(ctx);
        //
        // const ctxSecret = new ProcessContextSecret();
        //
        // ctxSecret.secretId = secret.id;
        // ctxSecret.tenantId = 'b7f9092f-5973-c781-08db-4d6e48f78e98';
        // ctxSecret.processContextId = ctx.id;
        // ctxSecret.name = 'dupa';
        //
        // await this.processContextRepository.manager.save(ProcessContextSecret, ctxSecret);
        //
        // const result = await this.getDecryptedContext(1001, 'b7f9092f-5973-c781-08db-4d6e48f78e98');
        // console.log('decrypted data', util.inspect(result.secrets[0].secret));
    }

    async getDecryptedContext(processId: number, tenantId: string): Promise<DecryptedProcessContextDto> {
        // @TODO create mechanism to check if user exists in tenant after tenantId is added
        const processContext = await this.processContextRepository.findOne(
            {
                where: {
                    processId,
                    tenantId,
                },
                relations: {
                    secrets: {
                        secret: true,
                    },
                },
            },
        );

        const secrets: DecryptedProcessContextDtoSecret[] = processContext.secrets.map(processSecret => {
            return {
                id: processSecret.id,
                name: processSecret.name,
                processContextId: processSecret.processContextId,
                secret: {
                    id: processSecret.secretId,
                    tenantId: processSecret.secret.tenantId,
                    data: this.secretService.decrypt(processSecret.secret),
                },
                secretId: processSecret.secretId
            };
        });

        return {
            id: processContext.id,
            processId,
            secrets
        }
    }
}
