import { User } from '#/scheduler-database/user/user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProcessCredential } from './process-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { CreateProcessCredentialDto } from './dto/create-process-credential.dto';
import { Credential } from '../credential/credential.entity';
import { EditProcessCredentialsDto } from './dto/update-process-credentials.dto';
import _ from 'lodash';

@Injectable()
export class ProcessCredentialService {
    constructor(
        @InjectRepository(ProcessCredential)
        private readonly processCredentialRepository: Repository<ProcessCredential>,
        @InjectRepository(Credential)
        private readonly credentialRepository: Repository<Credential>,
        private readonly processService: ProcessService,
    ) {}

    async findAllByProcessId(processId: number, user: User, templateId?: string) {
        await this.processService.checkAccessAndGetById(processId, user);
        const templateFindOption = templateId ? { templateId } : {};

        return this.processCredentialRepository.find({
            where: {
                process: { id: processId },
                credential: {
                    tenantId: user.tenantId,
                    ...templateFindOption
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

    async update(processId: number, user: User, processCredentialsToUpdate: EditProcessCredentialsDto) {
        const currentProcessCredentialsForTemplate = await this.findAllByProcessId(
            processId,
            user,
            processCredentialsToUpdate.templateId
        );

        if (!currentProcessCredentialsForTemplate.length) throw new BadRequestException();

        const intersection = _.intersectionBy(
            processCredentialsToUpdate.credentials,
            currentProcessCredentialsForTemplate,
            'id'
        );

        if (currentProcessCredentialsForTemplate.length !== intersection.length) {
            throw new BadRequestException();
        }

        return this.processCredentialRepository.manager.transaction(
            async (manager) => {
                await Promise.all(processCredentialsToUpdate.credentials.map(async (credential) => {
                    const partial: Partial<ProcessCredential> = {};

                    partial.order = credential.order;

                    return manager
                        .getRepository(ProcessCredential)
                        .update({ id: credential.id }, partial);
                }));
            }
        )
        .then(() => {
            return this.findAllByProcessId(processId, user);
        })
        .catch((error) => {
            if (error.message) {
                throw new BadRequestException(`Failed to update credentials. ${error.message}`);
            }

            throw new BadRequestException(`Failed to update credentials for processId: ${processId}`);
        });
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
