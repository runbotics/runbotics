import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { IProcess } from 'runbotics-common';
import { UserEntity } from '../user/user.entity';
import { isTenantAdmin } from '#/utils/authority.utils';


const relations = [
    'createdBy',
    'system',
    'botCollection',
    'schedules',
    'editor',
    'notifications.user.authorities',
    'processCredential.credential.attributes',
    'processCredential.credential.template',
];

interface PartialUpdateProcess extends IProcess {
    id: IProcess['id'];
}

@Injectable()
export class ProcessService {
    constructor(
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
    ) {
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

    async save(process: IProcess) {
        await this.processRepository.save(process);
        return process;
    }

    partialUpdate(process: PartialUpdateProcess) {
        return this.processRepository.update({ id: process.id }, process);
    }

    async checkAccessAndGetById(processId: number, user: UserEntity) {
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

    async createGuestProcess() {
        
    }
}
