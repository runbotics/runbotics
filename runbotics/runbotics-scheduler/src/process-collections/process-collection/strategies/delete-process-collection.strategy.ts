import { CollectionStrategy } from './base.strategy';
import { NotFoundException } from '@nestjs/common';
import { TreeRepository } from 'typeorm';
import { ProcessCollection } from '../process-collection.entity';

export class DeleteProcessCollectionStrategy implements CollectionStrategy<ProcessCollection> {
    constructor(
        private readonly repo: TreeRepository<ProcessCollection>) {
    }

    async execute(processCollectionId: string): Promise<ProcessCollection> {
        const toRemove = await this.repo.findOne({ where: { id: processCollectionId } });

        if (!toRemove) {
            throw new NotFoundException(`ProcessCollection with id ${processCollectionId} not found`);
        }

        const deleted = await this.repo.delete({ id: processCollectionId });
        return deleted.raw as ProcessCollection;
    }
}
