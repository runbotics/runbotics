import { EntityManager } from 'typeorm';
import { ProcessCollection } from '#/process-collections/process-collection/process-collection.entity';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import { ProcessCollectionUser } from '#/process-collections/process-collection-user/process-collection-user.entity';

export const loadRecursive = async (
    node: ProcessCollection,
    entityManager: EntityManager,
): Promise<ProcessCollection> => {
    const copy = structuredClone(node);
    copy.processCollectionLinks = await entityManager.find(ProcessCollectionLink, {where: {id: copy.id}});
    copy.processCollectionPrivileges = await entityManager.find(ProcessCollectionUser, {where: {processCollectionId: copy.id}});

    if (copy.children?.length) {
        const newChildren = [];
        for (const child of copy.children) {
            newChildren.push(await loadRecursive(child, entityManager));
        }
        copy.children = newChildren;
    }

    return copy;
};
