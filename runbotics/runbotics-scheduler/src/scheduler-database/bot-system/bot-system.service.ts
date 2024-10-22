import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotSystem } from './bot-system.entity';
import { BotSystemType } from 'runbotics-common';

@Injectable()
export class BotSystemService {
    constructor(
        @InjectRepository(BotSystem)
        private botSystemRepository: Repository<BotSystem>,
    ) { }

    findByName(name: BotSystemType): Promise<BotSystem> {
        return this.botSystemRepository.findOne({ where: { name } });
    }
}
