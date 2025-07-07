import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { CreateProcessCollectionDto } from '../dto/create-process-collection.dto';
import { ProcessCollection } from '../process-collection.entity';

export class CreateProcessCollectionStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>,
    ) {
    }

    async execute(dto: CreateProcessCollectionDto, userId?: number): Promise<ProcessCollection> {
        const parent = await this.repo.findOne({ where: { id: dto.parentId } });
        let root;
        if(!parent) {
            root = await this.repo.findOne({ where: { name: 'ROOT', description: 'ROOT', parent: null } });
        }
        const saved = await this.repo.save({
            ...dto,
            created_by: userId,
            parentId: dto.parentId,
            ownerId: (parent?.name === 'ROOT' || !parent) ? userId : parent.owner.id,
            parent: parent ? parent : root,
            userId,
        });

        return saved as ProcessCollection;
    }
}
