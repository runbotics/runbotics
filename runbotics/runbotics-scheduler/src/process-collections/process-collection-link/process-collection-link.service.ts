import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { ProcessCollectionLink } from '#/process-collections/process-collection-link/process-collection-link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AddProcessCollectionLinkDto,
} from '#/process-collections/process-collection-link/dto/add-process-collection-link.dto';
import { Logger } from '#/utils/logger';
import { inspect } from 'util';

@Injectable()
export class ProcessCollectionLinkService {
    private readonly logger = new Logger(ProcessCollectionLink.name);

    constructor(
        @InjectRepository(ProcessCollectionLink)
        private readonly processCollectionLinkRepository: Repository<ProcessCollectionLink>,
    ) {
    }

    async addNewProcessCollectionLink(processCollectionLinkDto: AddProcessCollectionLinkDto): Promise<ProcessCollectionLink> {
        const newProcessCollectionLink = await this.processCollectionLinkRepository.save(processCollectionLinkDto);
        this.logger.log(inspect(newProcessCollectionLink, { depth: 3 }));
        return newProcessCollectionLink;
    }

    async getProcessCollectionLink(id: string): Promise<ProcessCollectionLink> {
        return this.processCollectionLinkRepository.findOne({ where: { id } });
    }

    async deleteProcessCollectionLink(id: string): Promise<DeleteResult> {
        return this.processCollectionLinkRepository.delete(id);
    }

    async getProcessCollectionLinkByCollectionId(collectionId: number): Promise<ProcessCollectionLink[]> {
        return this.processCollectionLinkRepository.find({ where: { collectionId } });
    }
}
