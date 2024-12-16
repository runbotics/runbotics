import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TriggerEvent as TriggerEvenName } from 'runbotics-common';

import { TriggerEvent } from './trigger-event.entity';

@Injectable()
export class TriggerEventService {
    constructor(
        @InjectRepository(TriggerEvent)
        private processTriggerEventRepository: Repository<TriggerEvent>
    ) {}

    findByName(name: TriggerEvenName) {
        return this.processTriggerEventRepository.findOne({ where: { name } });
    }
}
