import { UserEntity } from '#/database/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessCredential } from './process-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessService } from '#/database/process/process.service';

@Injectable()
export class ProcessCredentialService {
    constructor(
        @InjectRepository(ProcessCredential)
        private readonly processCredentialRepository: Repository<ProcessCredential>,
        private readonly processService: ProcessService,
    ) {}

    async findAllByProcessId(processId: number, user: UserEntity) {
        await this.processService.checkAccessAndGetById(processId, user);

        return this.processCredentialRepository.find({
            where: {
                process: { id: processId },
                credential: {
                    tenantId: user.tenantId,
                }
            },
            relations: ['credential.template', 'credential.createdBy', 'credential.collection']
        }).then(this.formatProcessCredentials);
    }

    async delete(id: string, user: UserEntity) {
        const processCredential = await this.processCredentialRepository.findOneOrFail({
            where: { id, credential: { tenantId: user.tenantId } }, relations: ['process']
        }).catch(() => {
            throw new NotFoundException();
        });

        await this.processService.checkAccessAndGetById(
            processCredential.process.id, user
        );

        await this.processCredentialRepository.delete(id);
    }

    private formatProcessCredentials(processCredentials: ProcessCredential[]) {
        return processCredentials.map(processCredential => ({
            ...processCredential,
            credential: {
                id: processCredential.credential.id,
                name: processCredential.credential.name,
                createdBy: {
                    id: processCredential.credential.createdBy.id,
                    login: processCredential.credential.createdBy.login,
                },
                template: {
                    id: processCredential.credential.template.id,
                    name: processCredential.credential.template.name
                },
                collection: {
                    id: processCredential.credential.collectionId,
                    name: processCredential.credential.collection.name
                }
            },
        }));
    }
}
