import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ProcessInstanceEntity} from './process-instance.entity';
import {IProcessInstance} from 'runbotics-common';

const relations = ['bot', 'process', 'user', 'trigger'];

@Injectable()
export class ProcessInstanceService {
    constructor(
        @InjectRepository(ProcessInstanceEntity)
        private processInstanceRepository: Repository<ProcessInstanceEntity>,
    ) {}

    findById(id: string): Promise<IProcessInstance> {
        return this.processInstanceRepository.findOne({ where: { id }, relations });
    }

    findAllByBotId(id: number): Promise<IProcessInstance[]> {
        return this.processInstanceRepository.find({ where: { bot: { id } } });
    }

    save(process: IProcessInstance) {
        return this.processInstanceRepository.save(process);
    }

    findAll(): Promise<IProcessInstance[]> {
        return this.processInstanceRepository.find({ relations });
    }

    delete(id: IProcessInstance['id']) {
        return this.processInstanceRepository.delete(id);
    }
}