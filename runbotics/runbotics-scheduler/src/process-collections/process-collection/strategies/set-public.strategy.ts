import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { PrivilegeType } from 'runbotics-common';
import { loadRecursive } from '#/process-collections/process-collection/utils/load-descendance-relations.util';
import {
    updateRecursiveProcessCollection,
} from '#/process-collections/process-collection/utils/updateRecursiveProcessCollection.util';

export class SetProcessCollectionPublicStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
    ) {
    }

    async execute(id: string, isPublic?: boolean): Promise<ProcessCollection> {
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

            await manager.remove(existing);
            delete childrenWithRelations.id;

            const saved = await updateRecursiveProcessCollection(
                childrenWithRelations,
                manager,
                existing.parentId,
                PrivilegeType.READ,
                !!isPublic,
            );
            return saved;
        });
    }
}
