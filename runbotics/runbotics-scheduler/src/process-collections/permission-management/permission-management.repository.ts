import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { PrivilegeType } from 'runbotics-common';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { Logger } from '#/utils/logger';

@Injectable()
export class PermissionRepository {
    private readonly logger = new Logger(PermissionRepository.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource,
    ) {
    }

    async getAllDescendants(transactionalEntityManager: EntityManager, collectionId: string) {
        const directChildren = await transactionalEntityManager.find(ProcessCollection, {
            where: {
                parent: {
                    id: collectionId,
                },
            },
        });

        let allDescendants = [...directChildren];

        for (const child of directChildren) {
            const childDescendants = await this.getAllDescendants(transactionalEntityManager, child.id);
            allDescendants = allDescendants.concat(childDescendants);
        }

        return allDescendants;
    }
    
    async getAccessByCollectionId(collectionId: string) {
        return this.dataSource.manager.find(ProcessCollectionUser, {
            where: { processCollectionId: collectionId },
        });
    }

    async getUserAccess(userId: number, collectionId: string) {
        return this.dataSource.manager.findOne(
            ProcessCollectionUser,
            { where: { userId, processCollectionId: collectionId } },
        );
    }

    async grantAccess(userId: number, collectionId: string, accessLevel: PrivilegeType, entityManager?: EntityManager) {
        const transactionalEntityManager = entityManager || this.dataSource.manager;
        //Note: If a transaction is started by param entityManager, calling new transaction will actually continue the original one
        await transactionalEntityManager.transaction(async (transactionalEntityManager) => {
            const collection = await transactionalEntityManager.findOne(
                ProcessCollection,
                { where: { id: collectionId } },
            );
            if (!collection) {
                throw new Error(`Collection with id ${collectionId} not found`);
            }

            const existingAccess = await transactionalEntityManager.findOne(ProcessCollectionUser, {
                where: { userId, processCollectionId: collectionId },
            });

            if (existingAccess) {
                existingAccess.privilege_type = accessLevel;
                await transactionalEntityManager.save(existingAccess);
            } else {
                await transactionalEntityManager.save(ProcessCollectionUser, {
                    userId,
                    processCollectionId: collectionId,
                    privilege_type: accessLevel,
                });
            }

            const children = await this.getAllDescendants(transactionalEntityManager, collectionId);

            for (const child of children) {
                const childAccess = transactionalEntityManager.create(ProcessCollectionUser, {
                    userId,
                    processCollectionId: child.id,
                    privilege_type: accessLevel,
                });
                await transactionalEntityManager.save(childAccess);
            }
        });
    }

    async revokeAccess(userId: number, collectionId: string, entityManager?: EntityManager) {
        const transactionalEntityManager = entityManager || this.dataSource.manager;
        //Note: If a transaction is started by param entityManager, calling new transaction will actually continue the original one
        await transactionalEntityManager.transaction(async (transactionalEntityManager) => {
            const collection = await transactionalEntityManager.findOne(
                ProcessCollection,
                { where: { id: collectionId } },
            );
            if (!collection) {
                throw new Error(`Collection with id ${collectionId} not found`);
            }

            await transactionalEntityManager.delete(ProcessCollectionUser, {
                userId,
                processCollectionId: collectionId,
            });

            const children = await this.getAllDescendants(transactionalEntityManager, collectionId);

            for (const child of children) {
                await transactionalEntityManager.delete(ProcessCollectionUser, {
                    userId,
                    processCollectionId: child.id,
                });
            }
        });
    }
}
