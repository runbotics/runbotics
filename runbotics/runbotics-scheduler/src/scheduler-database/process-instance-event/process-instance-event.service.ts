import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessInstanceEvent } from './process-instance-event.entity';
import { ProcessInstanceEventStatus } from 'runbotics-common';
import { ProcessInstance } from '../process-instance/process-instance.entity';

@Injectable()
export class ProcessInstanceEventService {
    constructor(
        @InjectRepository(ProcessInstanceEvent)
        private processInstanceEventRepository: Repository<ProcessInstanceEvent>
    ) {}

    findOneByExecutionId(executionId: ProcessInstanceEvent['executionId']) {
        return this.processInstanceEventRepository.findOne({
            where: { executionId },
            relations: ['processInstance'],
        });
    }

    findAllActiveByProcessInstanceId(processInstanceId: ProcessInstance['id']) {
        return this.processInstanceEventRepository.findBy({
            processInstance: { id: processInstanceId },
            status: ProcessInstanceEventStatus.IN_PROGRESS,
        });
    }
}
