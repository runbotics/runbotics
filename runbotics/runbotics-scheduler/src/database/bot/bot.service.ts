import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotEntity } from './bot.entity';
import {
    BotStatus,
    BotSystemType,
    DefaultCollections,
    IBot,
    IBotCollection,
    IBotSystem,
} from 'runbotics-common';

const relations = ['user', 'system', 'collection', 'notifications.user', 'collection.users'];

@Injectable()
export class BotService {
    constructor(
        @InjectRepository(BotEntity)
        private botRepository: Repository<BotEntity>
    ) {}

    findAll(): Promise<IBot[]> {
        return this.botRepository.find({ relations });
    }

    findById(id: number): Promise<IBot> {
        return this.botRepository.findOne({ where: { id }, relations });
    }

    findByInstallationId(installationId: string): Promise<IBot> {
        return this.botRepository.findOne({
            where: { installationId },
            relations,
        });
    }

    findByUserId(id: number): Promise<IBot> {
        return this.botRepository.findOne({
            where: { user: { id } },
            relations,
        });
    }

    async findAvailableCollection(
        collection: IBotCollection,
        system: IBotSystem,
    ): Promise<IBot[]> {

        const systemCondition = `${
            system.name === BotSystemType.ANY ? '' : 'bot.SYSTEM = :system'
        }`;

        const statusCondition =
            '(bot.status = :connected OR bot.status = :busy)';

        const collectionCondition = `
        (bot.collection_id = :collectionId
        ${
            collection.publicBotsIncluded
                ? 'OR bot_collection.name = :public OR bot_collection.name = :guest'
                : ''
        } )`;

        return await this.botRepository
            .createQueryBuilder('bot')
            .leftJoinAndSelect('bot.collection', 'bot_collection')
            .where(systemCondition)
            .andWhere(statusCondition)
            .andWhere(collectionCondition)
            .setParameters({
                collectionId: collection.id,
                system: system.name,
                connected: BotStatus.CONNECTED,
                busy: BotStatus.BUSY,
                public: DefaultCollections.PUBLIC,
                guest: DefaultCollections.GUEST,
            })
            .getMany();
    }

    async updateConnectedBotStatus(botId: IBot['id']) {
        const statusCondition =
            'bot.status = :disconnected';

        const botIdCondition =
            'bot.id = :botId';

        await this.botRepository
            .createQueryBuilder('bot')
            .update()
            .set({
                status: BotStatus.CONNECTED,
            })
            .setParameters({
                botId,
                disconnected: BotStatus.DISCONNECTED,
            })
            .where(botIdCondition)
            .andWhere(statusCondition)
            .execute();
    }

    save(bot: IBot) {
        return this.botRepository.save(bot);
    }

    saveAll(bots: IBot[]) {
        return this.botRepository.save(bots);
    }

    delete(id: IBot['id']) {
        return this.botRepository.delete(id);
    }

    setBusy(bot: IBot) {
        const mappedBot = { ...bot, status: BotStatus.BUSY };
        return this.save(mappedBot);
    }
}
