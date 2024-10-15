import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessCollectionEntity } from '#/database/process-collection/process-collection.entity';
import { UserEntity } from '#/database/user/user.entity';
import { FeatureKey } from 'runbotics-common';

@Injectable()
export class ProcessCollectionService {
    constructor(
        @InjectRepository(ProcessCollectionEntity)
        private processCollectionRepository: Repository<ProcessCollectionEntity>,
    ) {
    }
        async hasAccess(user: UserEntity, collectionId: string): Promise<boolean> {
            const featureKeys = user.authorities
                .flatMap(authority => authority.featureKeys)
                .map(key => key.name);

            if (featureKeys.includes(FeatureKey.PROCESS_ALL_ACCESS)) {
            return true;
        }
            
        const result = await this.processCollectionRepository.query(`
            WITH RECURSIVE ancestor AS
                               (SELECT pc.*, 1 AS depth
                                FROM process_collection pc
                                WHERE pc.id = $1
                                  AND pc.tenant_id = $3
                                UNION
                                SELECT pc.*, a.depth + 1
                                FROM ancestor a
                                         JOIN process_collection pc ON pc.id = a.parent_id
                                WHERE pc.tenant_id = $3)
            SELECT COUNT(*) = 0 as result
            FROM ancestor a
                     LEFT JOIN process_collection_user u ON
                (u.collection_id = a.id AND u.user_id = $2)
            WHERE u.user_id IS NULL
              AND a.is_public = FALSE
              AND a.created_by != 2
        `, [collectionId, user.id, user.tenantId]);

        return result[0].result;
    }
}
