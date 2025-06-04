import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { BotEntity } from './bot.entity';
import {
    BotStatus,
    BotSystemType,
    DefaultCollections,
    IBot,
    IBotCollection,
    IBotSystem,
} from 'runbotics-common';

const relations = ['user', 'system', 'collection', 'collection.users'];

@Injectable()
export class BotService {
    constructor(
        @InjectRepository(BotEntity)
        private botRepository: Repository<BotEntity>
    ) {}

    withEntityManager(em: EntityManager): BotService {
        return new BotService(em.getRepository(BotEntity));
    }

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
        const availableBots = collection.publicBotsIncluded ? await this.botRepository.find({
            where: [
                {
                    ...(system.name !== BotSystemType.ANY && { system }),
                    status: In([BotStatus.CONNECTED, BotStatus.BUSY]),
                    tenantId: collection.tenantId,
                    collectionId: collection.id,
                },
                {
                    ...(system.name !== BotSystemType.ANY && { system }),
                    status: In([BotStatus.CONNECTED, BotStatus.BUSY]),
                    tenantId: collection.tenantId,
                    collection: {
                        name: In([DefaultCollections.PUBLIC, DefaultCollections.GUEST]),
                    },
                }
            ],
            relations,
        }) : await this.botRepository.find({
            where: [
                {
                    ...(system.name !== BotSystemType.ANY && { system }),
                    status: In([BotStatus.CONNECTED, BotStatus.BUSY]),
                    tenantId: collection.tenantId,
                    collectionId: collection.id,
                },
            ],
            relations,
        })
        ;

        return availableBots;
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
