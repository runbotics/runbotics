import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotSystemEntity } from './bot-system.entity';
import { BotSystemType, IBotSystem } from 'runbotics-common';

@Injectable()
export class BotSystemService {
    constructor(
        @InjectRepository(BotSystemEntity)
        private botSystemRepository: Repository<BotSystemEntity>,
    ) { }

    findByName(name: BotSystemType): Promise<IBotSystem> {
        return this.botSystemRepository.findOne({ where: { name } });
    }
}
