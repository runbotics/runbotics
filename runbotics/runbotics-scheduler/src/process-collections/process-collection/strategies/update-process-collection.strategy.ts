import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { UpdateProcessCollectionDto } from '#/process-collections/process-collection/dto/update-process-collection.dto';
import { PermissionManagementService } from '#/process-collections/permission-management/permission-management.service';
import { PrivilegeType } from 'runbotics-common';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';

export class UpdateProcessCollectionStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
        private readonly permissionManagementService: PermissionManagementService,
    ) {
    }

    async execute(id: string, updates: UpdateProcessCollectionDto): Promise<ProcessCollection> {
        return this.repo.manager.transaction(async manager => {
            const existing = await manager.findOne(
                ProcessCollection,
                { where: { id }, relations: ['parent', 'children'] },
            );
            const privileges = await manager.find(ProcessCollectionUser, { where: { processCollectionId: id } });
            if (!existing) {
                throw new Error(`Collection with id ${id} not found`);
            }

            const previousState = { ...existing };
            await manager.remove(existing);
            delete previousState.id;

            const updated = await manager.save(ProcessCollection, {
                ...previousState,
                name: updates.name,
                description: updates.description,
                isPublic: updates.isPublic,
            });

            for (const privilege of privileges) {
                await this.permissionManagementService.revoke(privilege.userId, updated.id, manager);
                await this.permissionManagementService.grant(
                    privilege.userId,
                    updated.id,
                    privilege.privilege_type as PrivilegeType,
                    manager,
                );
            }
            if (updates.parentId) {
                const parent = await manager.findOne(ProcessCollection, { where: { id: updates.parentId } });
                if (!parent) throw new Error(`Parent collection ${updates.parentId} not found`);
                updated.parent = parent;
            }

            const saved = await manager.save(ProcessCollection, updated);

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
