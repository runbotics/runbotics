import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { UpdateProcessCollectionDto } from '#/process-collections/process-collection/dto/update-process-collection.dto';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import { PrivilegeType } from 'runbotics-common';
import { loadRecursive } from '#/process-collections/process-collection/utils/load-descendance-relations.util';
import {
    updateRecursiveProcessCollection,
} from '#/process-collections/process-collection/utils/updateRecursiveProcessCollection.util';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';

export class UpdateProcessCollectionStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
        private readonly permissionManagementService: PermissionManagementService,
    ) {
    }

    async execute(id: string, updates: UpdateProcessCollectionDto): Promise<ProcessCollection> {
        return this.repo.manager.transaction(async manager => {
            const treeRepository = manager.getTreeRepository(ProcessCollection);
            const existing = await manager.findOne(
                ProcessCollection,
                {
                    where: { id },
                    relations: ['parent'],
                },
            );

            if (!existing) {
                throw new Error(`Collection with id ${id} not found`);
            }

            const childrenWithRelations = await loadRecursive(
                await treeRepository.findDescendantsTree(existing),
                manager,
            );
            
            const changes = Object.assign(
                childrenWithRelations,
                { name: updates.name, description: updates.description },
            );
            await manager.remove(existing);
            delete childrenWithRelations.id;

            const saved = await updateRecursiveProcessCollection(
                changes,
                manager,
                updates.parentId ?? existing.parentId,
            );

            if (updates.users && updates.users.length > 0) {
                for (const user of updates.users) {
                    await this.permissionManagementService.grant(
                        user.id,
                        saved.id,
                        user.privilegeType as PrivilegeType,
                        manager,
                    );
                }
            }
            return saved;
        });
    }
}
