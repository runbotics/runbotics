import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessTriggerEntity } from './process-trigger.entity';
import { IProcessTrigger } from 'runbotics-common';

@Injectable()
export class ProcessTriggerService {
    constructor(
        @InjectRepository(ProcessTriggerEntity)
        private processTriggerRepository: Repository<ProcessTriggerEntity>,
    ) {}

    findByName(name: string): Promise<IProcessTrigger> {
        return this.processTriggerRepository.findOne({ where: { name } });
    }
}