import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { IProcess } from 'runbotics-common';

const relations = ['createdBy', 'system', 'botCollection', 'schedules', 'editor', 'notifications.user.authorities'];

interface PartialUpdateProcess extends IProcess {
    id: IProcess['id'];
}

@Injectable()
export class ProcessService {
    constructor(
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
    ) { }

    findById(id: number): Promise<IProcess> {
        return this.processRepository.findOne({ where: { id }, relations });
    }

    async save(process: IProcess) {
        await this.processRepository.save(process);
        return process;
    }

    partialUpdate(process: PartialUpdateProcess) {
        return this.processRepository.update({ id: process.id }, process);
    }
}
