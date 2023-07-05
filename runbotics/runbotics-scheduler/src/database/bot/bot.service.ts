import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Brackets, Repository} from 'typeorm';
import {BotEntity} from './bot.entity';
import {BotStatus, BotSystem, IBot, IBotCollection, IBotSystem} from 'runbotics-common';

const relations = ['user', 'system', 'collection'];

@Injectable()
export class BotService {
    constructor(
        @InjectRepository(BotEntity)
        private botRepository: Repository<BotEntity>
    ) {
    }

    findAll(): Promise<IBot[]> {
        return this.botRepository.find({relations});
    }

    findById(id: number): Promise<IBot> {
        return this.botRepository.findOne({ where: { id }, relations});
    }

    findByInstallationId(installationId: string): Promise<IBot> {
        return this.botRepository.findOne({ where: { installationId }, relations});
    }

    findByUserId(id: number): Promise<IBot> {
        return this.botRepository.findOne({ where: { user: { id } }, relations});
    }

    async findByCollectionNameAndSystem(
        collectionName: string,
        system: IBotSystem
    ): Promise<IBot[]> {
        return await this.botRepository.createQueryBuilder('bot')
        .where(`${system.name === BotSystem.ANY?'':'bot.SYSTEM = :system'}`)
        .leftJoinAndSelect('bot.collection','bot_collection')
        .andWhere('(bot.status = :connected OR bot.status = :busy)')
        .andWhere('(bot_collection.name = :collectionName )')
        .setParameters({
            system: system.name,
            collectionName: collectionName,
            connected: BotStatus.CONNECTED,
            busy: BotStatus.BUSY
        }).getMany();
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
        const mappedBot = {...bot, status: BotStatus.BUSY};
        return this.save(mappedBot);
    }
}
