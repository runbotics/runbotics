import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { ProcessCollectionLinkService } from '../../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../../process-collection-user/process-collection-user.service';
import { CollectionStrategy } from '#/process-collections/process-collection/strategies/base.strategy';

export class GetAllCollectionsStrategy implements CollectionStrategy<ProcessCollection | null> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
        private readonly linkService: ProcessCollectionLinkService,
        private readonly userService: ProcessCollectionUserService,
    ) {
    }

    private async loadRecursive(node: ProcessCollection): Promise<ProcessCollection> {
        const copy = structuredClone(node);
        copy.processCollectionLinks = await this.linkService.getProcessCollectionLinkByCollectionId(copy.id);
        copy.processCollectionPrivileges = await this.userService.getAllProcessCollectionUserByCollectionId(copy.id);

        if (copy.children?.length) {
            const newChildren = [];
            for (const child of copy.children) {
                newChildren.push(await this.loadRecursive(child));
            }
            copy.children = newChildren;
        }

        return copy;
    }

    async execute(userId: number, parentId?: string): Promise<ProcessCollection | null> {
        if (parentId) {
            const root = await this.repo.findOne({ where: { parent: { id: parentId } } });
            if (!root) return null;

            const tree = await this.repo.findDescendantsTree(root);
            return await this.loadRecursive(tree);
        }
        const root = await this.repo.findOne({ where: { name: 'ROOT', description: 'ROOt', parent: null } });
        if (!root) return null;

        const tree = await this.repo.findDescendantsTree(root);
        const userCollectionRoot = tree.children.find(collection => collection.ownerId === userId);
        if (!userCollectionRoot) return null;
        return await this.loadRecursive(userCollectionRoot);
    }
}
