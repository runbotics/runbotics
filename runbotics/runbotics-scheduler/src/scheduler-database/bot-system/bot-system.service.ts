import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotSystem } from './bot-system.entity';
import { BotSystemType, IBotSystem } from 'runbotics-common';

@Injectable()
export class BotSystemService {
    constructor(
        @InjectRepository(BotSystem)
        private botSystemRepository: Repository<BotSystem>,
    ) { }

    findByName(name: BotSystemType): Promise<IBotSystem> {
        return this.botSystemRepository.findOne({ where: { name } });
    }
}
