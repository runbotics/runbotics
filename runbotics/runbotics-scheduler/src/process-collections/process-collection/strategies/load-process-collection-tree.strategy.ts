import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { ProcessCollectionLinkService } from '../../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../../process-collection-user/process-collection-user.service';

export class LoadProcessCollectionTreeStrategy implements CollectionStrategy<ProcessCollection | null> {
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

    async execute(collectionId: string): Promise<ProcessCollection | null> {
        const root = await this.repo.findOne({ where: { id: collectionId } });
        if (!root) return null;

        const tree = await this.repo.findDescendantsTree(root);
        return await this.loadRecursive(tree);
    }
}
