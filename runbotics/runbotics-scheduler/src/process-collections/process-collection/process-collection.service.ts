import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessCollection } from './process-collection.entity';
import { InsertProcessCollectionDTO } from './dto/insert-process-collection.dto';
import { TreeRepository } from 'typeorm';
import { Logger } from '#/utils/logger';
import { ProcessCollectionLinkService } from '../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../process-collection-user/process-collection-user.service';

@Injectable()
export class ProcessCollectionService {

    private readonly logger = new Logger(ProcessCollectionService.name);

    constructor(
        @InjectRepository(ProcessCollection)
        private readonly processCollectionRepository: TreeRepository<ProcessCollection>,
        @Inject(forwardRef(() => ProcessCollectionLinkService))
        private readonly processCollectionLinkService: ProcessCollectionLinkService,
        private readonly processCollectionUserService: ProcessCollectionUserService,
    ) {
    }

    async loadRelationsRecursive(processCollection: ProcessCollection): Promise<ProcessCollection> {
        const node = structuredClone(processCollection);
        node.processCollectionLinks = await this.processCollectionLinkService.getProcessCollectionLinkByCollectionId(
            node.id);
        node.processCollectionPrivileges = await this.processCollectionUserService.getAllProcessCollectionUserByCollectionId(
            node.id);

        if (node.children) {
            const newCollection = [];
            for (const child of node.children) {
                newCollection.push(await this.loadRelationsRecursive(child));
            }
            node.children = newCollection;
        }
        return node;
    }

    async insertNewProcessCollection(
        processCollection: InsertProcessCollectionDTO,
        userId?: number,
    ): Promise<ProcessCollection> {
        const parentCollection = await this.processCollectionRepository.findOne({ where: { id: processCollection.parentId } });
        const newProcessCollection = await this.processCollectionRepository.save({
            ...processCollection,
            createdBy: null,
            parentId: processCollection.parentId,
            parent: parentCollection,
            userId: userId,
        });
        return newProcessCollection as unknown as ProcessCollection;
    }

    async deleteProcessCollection(processCollectionId: number): Promise<ProcessCollection> {
        const processCollectionToRemove = await this.processCollectionRepository.findOne({ where: { id: processCollectionId } });
        if (!processCollectionToRemove) {
            throw new NotFoundException(`ProcessCollection with id ${processCollectionId} not found`);
        }
        const collectionToDelete = await this.processCollectionRepository.delete({ id: processCollectionId });
        return collectionToDelete.raw as ProcessCollection;
    }

    async getProcessCollectionTree(processCollectionId: number): Promise<ProcessCollection | ProcessCollection[]> {
        const processCollection = await this.processCollectionRepository.findOne({ where: { id: processCollectionId } });
        if (!processCollection) {
            return null;
        }
        const processCollectionTree = await this.processCollectionRepository.findDescendantsTree(processCollection);

        if (!processCollectionTree) {
            return null;
        }

        const collectionTreeWithDeps = await this.loadRelationsRecursive(processCollectionTree);
        // const descendants = await this.processCollectionRepository.findDescendants(processCollection);
        //
        // const collectionsWithRelations = await this.processCollectionRepository.find({
        //     where: { id: In(descendants.map(d => d.id)) },
        //     relations: ['processCollectionPrivileges', 'processCollectionLinks'],
        // });
        return collectionTreeWithDeps;
    }
}
