import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBotCollection } from 'runbotics-common';
import { BotCollectionEntity } from './bot_collection.entity';

const relations = [ 'createdByUser', 'user' ];

@Injectable()
export class BotCollectionService {
    constructor(
        @InjectRepository(BotCollectionEntity)
        private botCollectionRepository: Repository<BotCollectionEntity>,
    ) { }

    findById(id: string): Promise<IBotCollection> {
        return this.botCollectionRepository.findOne({ id }, { relations });
    }

    findByName(botCollectionName: string): Promise<IBotCollection> {
        return this.botCollectionRepository.findOne({ where: { botCollectionName }, relations });
    }

    async save(botCollection: IBotCollection) {
        await this.botCollectionRepository.save(botCollection);
        return botCollection;
    }
}