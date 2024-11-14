import { UserEntity } from '#/database/user/user.entity';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ProcessCredential } from './process-credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { CreateProcessCredentialDto } from './dto/create-process-credential.dto';
import { Credential } from '../credential/credential.entity';

@Injectable()
export class ProcessCredentialService {
    constructor(
        @InjectRepository(ProcessCredential)
        private readonly processCredentialRepository: Repository<ProcessCredential>,
        @InjectRepository(Credential)
        private readonly credentialRepository: Repository<Credential>,
        private readonly processService: ProcessService,
        private readonly connection: Connection,
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

    async create(processCredentialDto: CreateProcessCredentialDto, user: UserEntity) {
        const process = await this.processService.checkAccessAndGetById(
            +processCredentialDto.processId, user
        );

        const credential = await this.credentialRepository.findOneByOrFail({
            id: processCredentialDto.credentialId, tenantId: user.tenantId
        }).catch(() => {
            throw new NotFoundException('Cannot find credential with provided id');
        });

        const lastCredentialOrder: number =
            await this.processCredentialRepository
                .createQueryBuilder('pc')
                .select('MAX(pc.order)', 'max')
                .innerJoin('pc.credential', 'credential')
                .innerJoin(
                    'credential.template',
                    'template',
                    'template.name = :templateName',
                    { templateName: processCredentialDto.templateName }
                )
                .where('pc.processId = :processId', {
                    processId: processCredentialDto.processId,
                })
                .groupBy('template.name')
                .getRawOne()
                .then(result => result.max)
                .catch(() => 0);

        const newProcessCredential = new ProcessCredential();
        newProcessCredential.process = process;
        newProcessCredential.credential = credential;
        newProcessCredential.order = lastCredentialOrder + 1;
        await this.processCredentialRepository.insert(newProcessCredential);
    }

    async delete(id: string, user: UserEntity) {
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

        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(ProcessCredential, id);

            const credentialsToUpdate = await queryRunner.manager
                .getRepository(ProcessCredential)
                .createQueryBuilder('pc')
                .select('pc.credentialId')
                .innerJoin('pc.credential', 'credential')
                .innerJoin('credential.template', 'template')
                .where('pc.processId = :processId', { processId })
                .andWhere(
                    'template.name = :templateName',
                    { templateName: processCredential.credential.template.name }
                ).andWhere(
                    'pc.order > :removedOrder',
                    { removedOrder: processCredential.order }
                ).getMany();

            if (credentialsToUpdate.length) {
                await queryRunner.manager
                .createQueryBuilder()
                .update(ProcessCredential)
                .set({ order: () => 'order - 1' })
                .where(
                    'credentialId IN (:...credIds)',
                    { credIds: credentialsToUpdate.map(cred => cred.credentialId) }
                ).execute();
            }

            await queryRunner.commitTransaction();
        } catch {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
        } finally {
            await queryRunner.release();
        }
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
