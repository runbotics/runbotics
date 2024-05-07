import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessContext } from '#/database/process-context/process-context.entity';
import {
    DecryptedProcessContextDto,
    DecryptedProcessContextDtoSecret,
} from '#/database/process-context/decrypted-process-context.dto';
import { SecretService } from '#/database/secret/secret.service';

@Injectable()
export class ProcessContextService {
    constructor(
        @InjectRepository(ProcessContext)
        private processContextRepository: Repository<ProcessContext>,
    ) {
    }

    async getDecryptedContext(processId: string): Promise<DecryptedProcessContextDto> {
        const processContext = await this.processContextRepository.findOne(
            {
                where: {
                    processId,
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
                    data: SecretService.decrypt(processSecret.secret),
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
