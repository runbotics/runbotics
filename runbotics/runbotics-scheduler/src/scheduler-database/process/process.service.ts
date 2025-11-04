import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { IProcess } from 'runbotics-common';
import { isTenantAdmin } from '#/utils/authority.utils';
import { User } from '#/scheduler-database/user/user.entity';
import { ProcessCollectionService } from '../process-collection/process-collection.service';

const relations = [
    'createdBy',
    'system',
    'botCollection',
    'schedules',
    'editor',
    'processCollection',
    'notifications.user.authorities',
    'processCredential.credential.attributes',
    'processCredential.credential.template',
    'webhookTriggers'
];

interface PartialUpdateProcess extends IProcess {
    id: IProcess['id'];
}

@Injectable()
export class ProcessService {
    constructor(
        @InjectRepository(ProcessEntity)
        private readonly processRepository: Repository<ProcessEntity>,
        private readonly processCollectionService: ProcessCollectionService,
    ) {}

    withEntityManager(em: EntityManager): ProcessService {
        return new ProcessService(
            em.getRepository(ProcessEntity),
            this.processCollectionService.withEntityManager(em)
        );
    }

    findById(id: number): Promise<IProcess | null> {
        return this.processRepository.findOne({ where: { id }, relations });
    }

    findByIdAndTenantId(id: number, tenantId: string) {
        return this.processRepository.findOneByOrFail({ id, tenantId });
    }

    findByIdWithSecrets(id: number) {
        return this.processRepository.findOne({
            where: { id },
            relations: [...relations, 'processCredential.credential.attributes.secret'],
        });
    }

    findGuestDemoProcess(user: User) {
        return this.processRepository.findOneByOrFail({
            createdBy: { id: user.id }
        })
        .catch(() => {
            throw new NotFoundException();
        });
    }

    async save(process: IProcess) {
        await this.processRepository.save(process);
        return process;
    }

    partialUpdate(process: PartialUpdateProcess) {
        return this.processRepository.update({ id: process.id }, process);
    }

    async checkAccessAndGetById(processId: number, user: User) {
        // TODO: to be updated after process migration to scheduler
        // Explanation: Process privileges should be based on process collections
        // and checking privileges should be adjusted
        if (isTenantAdmin(user)) {
            return this.processRepository
                .findOneByOrFail({ id: processId, tenantId: user.tenantId })
                .catch(() => {
                    throw new NotFoundException();
                });
        }

        return this.processRepository
            .findOneByOrFail([
                {
                    id: processId,
                    tenantId: user.tenantId,
                    isPublic: true,
                },
                {
                    id: processId,
                    tenantId: user.tenantId,
                    createdBy: { id: user.id },
                },
            ])
            .catch(() => {
                throw new NotFoundException();
            });
    }

    async hasAccess(user: User, processId: number): Promise<boolean> {
        const process = await this.processRepository
            .findOneByOrFail({
                id: processId,
                tenantId: user.tenantId
            })
            .catch(() => {
                throw new NotFoundException(`Process with id ${processId} not found`);
            });

        return this.processCollectionService.hasAccess(user, process.processCollectionId);
    }

    async canConfigureProcess(user: User, processId: number): Promise<boolean> {
        const process = await this.findById(processId);

        return user.id === process.createdBy.id || isTenantAdmin(user);
    }
}
