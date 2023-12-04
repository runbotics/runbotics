import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBotCollection } from 'runbotics-common';
import { BotCollectionEntity } from './bot-collection.entity';

const relations = [ 'createdByUser', 'users' ];

@Injectable()
export class BotCollectionService {
    constructor(
        @InjectRepository(BotCollectionEntity)
        private botCollectionRepository: Repository<BotCollectionEntity>,
    ) { }

    findById(id: string): Promise<IBotCollection> {
        return this.botCollectionRepository.findOne({ where: { id }, relations });
    }

    findByName(name: string): Promise<IBotCollection> {
        return this.botCollectionRepository.findOne({ where: { name }, relations });
    }

    async save(botCollection: IBotCollection) {
        await this.botCollectionRepository.save(botCollection);
        return botCollection;
    }
}