import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessEntity } from './process.entity';
import { IProcess } from 'runbotics-common';

const relations = ['createdBy', 'system', 'botCollection'];

@Injectable()
export class ProcessService {
    constructor(
        @InjectRepository(ProcessEntity)
        private processRepository: Repository<ProcessEntity>,
    ) { }

    findById(id: number): Promise<IProcess> {
        return this.processRepository.findOne({ where: { id }, relations });
    }

    findByName(processName: string): Promise<IProcess> {
        return this.processRepository.findOne({ where: { name: processName }, relations });
    }

    async save(process: IProcess) {
        await this.processRepository.save(process);
        return process;
    }
    
    findByInfo(processInfo: string | number) {
        return isNaN(Number(processInfo))
            ? this.findByName(processInfo as string)
            : this.findById(Number(processInfo));
    }
}
