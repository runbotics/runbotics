import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ProcessInstanceEntity} from './process-instance.entity';
import {IProcessInstance} from 'runbotics-common';

const relations = ['bot', 'process', 'user'];

@Injectable()
export class ProcessInstanceService {
    constructor(
        @InjectRepository(ProcessInstanceEntity)
        private processInstanceRepository: Repository<ProcessInstanceEntity>,
    ) {}

    findById(id: string): Promise<IProcessInstance> {
        return this.processInstanceRepository.findOne({id}, {relations});
    }

    findAllByBotId(botId: number): Promise<IProcessInstance[]> {
        return this.processInstanceRepository.find({where: {bot: botId}});
    }

    save(process: IProcessInstance) {
        return this.processInstanceRepository.save(process);
    }

    findAll(): Promise<IProcessInstance[]> {
        return this.processInstanceRepository.find({relations});
    }

    delete(id: IProcessInstance['id']) {
        return this.processInstanceRepository.delete(id);
    }
}