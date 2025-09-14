import { EntityManager } from 'typeorm';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { inspect } from 'util';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import { PrivilegeType } from 'runbotics-common';

export const updateRecursiveProcessCollection = async (node: ProcessCollection, manager: EntityManager, parentId: string, filterPrivilegeType?: PrivilegeType, isPublic?: boolean) => {
    const { children, processCollectionPrivileges, processCollectionLinks, id, ...oldProcessCollection } = node;
    const parent = await manager.findOne(ProcessCollection, { where: { id: parentId } });
    const newCollection = await manager.save(
        ProcessCollection,
        { ...oldProcessCollection, parentId: parent.id, parent, isPublic },
    );

    if (processCollectionPrivileges && processCollectionPrivileges.length > 0) {
        const privilegesToSave = filterPrivilegeType ? processCollectionPrivileges.filter(privilegeToFilter => privilegeToFilter.privilege_type !== filterPrivilegeType) : processCollectionPrivileges;
        for (const privilege of privilegesToSave) {
            await manager.save(ProcessCollectionUser, { ...privilege, processCollectionId: newCollection.id });
        }
    }

    if (processCollectionLinks && processCollectionLinks.length > 0) {
        for (const link of processCollectionLinks) {
            await manager.save(ProcessCollectionLink, { ...link, collectionId: newCollection.id });
        }
    }
    //if children exist, update them recursively
    if (children && children.length > 0) {
        for (const child of children) {
            await updateRecursiveProcessCollection(child, manager, newCollection.id, filterPrivilegeType, isPublic);
        }
    }

    return newCollection;
}
