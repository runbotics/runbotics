import { CollectionStrategy } from './base.strategy';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';
import { UpdateProcessCollectionDto } from '#/process-collections/process-collection/dto/update-process-collection.dto';

export class UpdateProcessCollectionStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(private readonly repo: TreeRepository<ProcessCollection>) {}

    async execute({id, ...updates}: UpdateProcessCollectionDto): Promise<ProcessCollection> {
        const existing = await this.repo.findOne({ where: { id } });
        if (!existing) throw new Error(`Collection ${id} not found`);

        const updated = Object.assign(existing, updates);
        return this.repo.save(updated);
    }
}
