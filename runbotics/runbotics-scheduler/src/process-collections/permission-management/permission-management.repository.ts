import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, TreeRepository } from 'typeorm';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { PrivilegeType } from 'runbotics-common';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';

@Injectable()
export class PermissionRepository {
    constructor(
        @InjectRepository(ProcessCollectionUser)
        private readonly repo: Repository<ProcessCollectionUser>,
        @InjectRepository(ProcessCollection)
        private readonly processCollectionRepository: TreeRepository<ProcessCollection>,
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
    }

    async getUserAccess(userId: number, collectionId: string) {
        return this.repo.findOne({ where: { userId, processCollectionId: collectionId } });
    }

    //TODO: to implement whole logic with adding entries for children collections
    async grantAccess(userId: number, collectionId: string, accessLevel: PrivilegeType) {
        return this.repo.save({ userId, collectionId, privilege_type: accessLevel });
    }
    //TODO: to implement whole logic with removing entries for children collections
    async revokeAccess(userId: number, collectionId: string) {
        return this.repo.delete({ userId, processCollectionId: collectionId });
    }
}
