import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
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
        return this.botRepository.findOne(id, {relations});
    }

    findByInstallationId(installationId: string): Promise<IBot> {
        return this.botRepository.findOne({installationId}, {relations});
    }

    findByUserId(userId: number): Promise<IBot> {
        return this.botRepository.findOne({where: {userId}, relations});
    }

    async findByCollectionAndSystem(
        collection: IBotCollection,
        system: IBotSystem
    ): Promise<IBot[]> {
        const bots = await this.botRepository.find({relations});
        return bots
            .filter((bot) => system.name === BotSystem.ANY || bot.system.name === system.name)
            .filter((bot) => bot.collection.name === collection.name);
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
