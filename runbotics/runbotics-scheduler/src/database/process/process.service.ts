import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { FeatureKey, IProcess } from 'runbotics-common';
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

    async hasAccess(user: UserEntity, processId: number): Promise<boolean> {
        const featureKeys = user.authorities
            .flatMap(authority => authority.featureKeys)
            .map(key => key.name);

        if (featureKeys.includes(FeatureKey.PROCESS_ALL_ACCESS)) {
            return true;
        }

        const result = await this.processRepository.query(`
            WITH RECURSIVE ancestor AS
                               (SELECT pc.*, 1 AS depth
                                FROM process_collection pc
                                WHERE pc.id = '12a42b8b-e4d9-4fa3-bee8-3c4e0c64d90b'
                                  AND pc.tenant_id = $3
                                UNION
                                SELECT pc.*, a.depth + 1
                                FROM ancestor a
                                         JOIN process_collection pc ON pc.id = a.parent_id
                                WHERE pc.tenant_id = $3)
            SELECT COUNT(*) = 0 as result
            FROM ancestor a
                     LEFT JOIN process_collection_user u ON
                (u.collection_id = a.id AND u.user_id = 1)
            WHERE u.user_id IS NULL
              AND a.is_public = FALSE
              AND a.created_by != 1
        `, [processId, user.id, user.tenantId]);

        return result[0].result;
    }
}
