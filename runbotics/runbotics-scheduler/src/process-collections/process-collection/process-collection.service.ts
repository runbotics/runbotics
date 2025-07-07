import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessCollection } from './process-collection.entity';
import { CreateProcessCollectionDto } from './dto/create-process-collection.dto';
import { TreeRepository } from 'typeorm';
import { Logger } from '#/utils/logger';
import { ProcessCollectionLinkService } from '../process-collection-link/process-collection-link.service';
import { ProcessCollectionUserService } from '../process-collection-user/process-collection-user.service';
import { StrategyFactory } from './process-collection-strategy.factory';
import { UpdateProcessCollectionDto } from '#/process-collections/process-collection/dto/update-process-collection.dto';

@Injectable()
export class ProcessCollectionService {

    private readonly logger = new Logger(ProcessCollectionService.name);

    private strategyFactory: StrategyFactory;

    constructor(
        @InjectRepository(ProcessCollection)
        private readonly repo: TreeRepository<ProcessCollection>,
        @Inject(forwardRef(() => ProcessCollectionLinkService))
        private readonly linkService: ProcessCollectionLinkService,
        private readonly userService: ProcessCollectionUserService,
    ) {
        this.strategyFactory = new StrategyFactory(this.repo, this.linkService, this.userService);
    }

    async createProcessCollection(dto: CreateProcessCollectionDto, userId?: number) {
        const strategy = this.strategyFactory.createCreateStrategy();
        return strategy.execute(dto, userId);
    }

    async getAllProcessCollections(userId: number, parentId?: string) {
        const strategy = this.strategyFactory.createGetAllCollectionStrategy();
        return strategy.execute(userId, parentId);
    }

    async deleteProcessCollection(processCollectionId: string) {
        const strategy = this.strategyFactory.createDeleteStrategy();
        return strategy.execute(processCollectionId);
    }

    async getProcessCollectionTree(processCollectionId: string) {
        const strategy = this.strategyFactory.createLoadTreeStrategy();
        return strategy.execute(processCollectionId);
    }

    async updateProcessCollection(dto: UpdateProcessCollectionDto) {
        const strategy = this.strategyFactory.createUpdateStrategy();
        return strategy.execute(dto);
    }
}
