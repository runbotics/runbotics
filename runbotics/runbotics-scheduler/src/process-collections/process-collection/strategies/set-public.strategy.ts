import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import { PrivilegeType } from 'runbotics-common';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';

export class SetProcessCollectionPublicStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
        private readonly permissionManagementService: PermissionManagementService,
    ) {
    }

    private sanitizeTree(node: ProcessCollection) {
        delete node.id;
        node.isPublic = true;

        if (Array.isArray(node.children)) {
            for (const child of node.children) {
                this.sanitizeTree(child);
            }
        }
    }

    async execute(id: string): Promise<ProcessCollection> {
        const result = await this.repo.manager.transaction(async manager => {
            const existing = await manager.findOne(ProcessCollection, { where: { id } });
            const treeRepository = manager.getTreeRepository(ProcessCollection);
            if (!existing) {
                throw new Error(`Collection with id ${id} not found`);
            }
            const currentTree = await treeRepository.findDescendants(existing);
            const previousState = { ...currentTree };

            const privileges = await manager.find(
                ProcessCollectionUser,
                { where: { processCollectionId: id, privilege_type: PrivilegeType.WRITE } },
            );
            await manager.remove(existing);

            this.sanitizeTree(previousState[0]);

            const updated = await manager.save(ProcessCollection, previousState);
            // for (const privilege of privileges) {
            //     await this.permissionManagementService.grant(
            //         privilege.userId,
            //         updated.id,
            //         privilege.privilege_type as PrivilegeType,
            //         manager,
            //     );
            // }
            return updated;
        })
        return result[0];
    }
}
