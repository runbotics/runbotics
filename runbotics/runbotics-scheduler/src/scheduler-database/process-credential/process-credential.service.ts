import { User } from '#/scheduler-database/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProcessCredential } from './process-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { CreateProcessCredentialDto } from './dto/create-process-credential.dto';
import { Credential } from '../credential/credential.entity';
import { EditProcessCredentialArrayDto } from './dto/update-process-credentials.dto';

@Injectable()
export class ProcessCredentialService {
    constructor(
        @InjectRepository(ProcessCredential)
        private readonly processCredentialRepository: Repository<ProcessCredential>,
        @InjectRepository(Credential)
        private readonly credentialRepository: Repository<Credential>,
        private readonly processService: ProcessService,
    ) {}

    async findAllByProcessId(processId: number, user: User) {
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

    async create(processCredentialDto: CreateProcessCredentialDto, user: User) {
        const process = await this.processService.checkAccessAndGetById(
            +processCredentialDto.processId, user
        );

        await this.processCredentialRepository.manager.transaction(
            async (manager) => {
                const credential = await manager
                    .findOneByOrFail(Credential, {
                        id: processCredentialDto.credentialId,
                        tenantId: user.tenantId,
                    })
                    .catch(() => {
                        throw new NotFoundException(
                            'Cannot find credential with provided id'
                        );
                    });

                const lastCredentialOrder: number = await manager
                    .createQueryBuilder(ProcessCredential, 'pc')
                    .select('MAX(pc.order)', 'max')
                    .innerJoin('pc.credential', 'credential')
                    .innerJoin(
                        'credential.template',
                        'template',
                        'template.name = :templateName',
                        {
                            templateName: processCredentialDto.templateName,
                        }
                    )
                    .where('pc.processId = :processId', {
                        processId: processCredentialDto.processId,
                    })
                    .getRawOne()
                    .then((result) => result.max)
                    .catch(() => 0);

                const newProcessCredential = new ProcessCredential();
                newProcessCredential.process = process;
                newProcessCredential.credential = credential;
                newProcessCredential.order = lastCredentialOrder + 1;
                await manager.insert(ProcessCredential, newProcessCredential);
            }
        );
    }

    async update(processId: number, user: User, editDto: EditProcessCredentialArrayDto) {
        try {
            await Promise.all(editDto.map(async (credential) => {
                const partial: Partial<ProcessCredential> = {};

                partial.order = credential.order;

                return this.processCredentialRepository.update({ id: credential.id }, partial);
            }));

            return this.findAllByProcessId(processId, user);
        } catch (error) {
            throw new Error('Failed to update credentials for processId');
        }
    }

    async delete(id: string, user: User) {
        const processCredential = await this.processCredentialRepository.findOneOrFail({
            where: { id, credential: { tenantId: user.tenantId } },
            relations: ['process', 'credential.template']
        }).catch(() => {
            throw new NotFoundException();
        });

        const processId = processCredential.process.id;

        await this.processService.checkAccessAndGetById(
            processId, user
        );

        await this.processCredentialRepository.manager.transaction(
            async (manager) => {
                await manager.delete(ProcessCredential, id);

                const credentialsToUpdate = await manager
                    .createQueryBuilder(ProcessCredential, 'pc')
                    .select('pc.credentialId')
                    .innerJoin('pc.credential', 'credential')
                    .innerJoin('credential.template', 'template')
                    .where('pc.processId = :processId', { processId })
                    .andWhere('template.name = :templateName', {
                        templateName:
                            processCredential.credential.template.name,
                    })
                    .andWhere('pc.order > :removedOrder', {
                        removedOrder: processCredential.order,
                    })
                    .getMany();

                if (credentialsToUpdate.length) {
                    await manager
                        .createQueryBuilder()
                        .update(ProcessCredential)
                        .set({ order: () => 'order - 1' })
                        .where('credentialId IN (:...credIds)', {
                            credIds: credentialsToUpdate.map(
                                (cred) => cred.credentialId
                            ),
                        })
                        .andWhere('processId = :processId', { processId })
                        .execute();
                }
            }
        );
    }

    private formatProcessCredentials(processCredentials: ProcessCredential[]) {
        return processCredentials.map(processCredential => ({
            ...processCredential,
            credential: {
                id: processCredential.credential.id,
                name: processCredential.credential.name,
                createdBy: {
                    id: processCredential.credential.createdBy.id,
                    email: processCredential.credential.createdBy.email,
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
