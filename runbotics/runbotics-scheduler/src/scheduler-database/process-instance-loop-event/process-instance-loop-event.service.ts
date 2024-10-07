import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProcessInstanceLoopEvent } from './process-instance-loop-event.entity';

@Injectable()
export class ProcessInstanceLoopEventService {
    constructor(
        @InjectRepository(ProcessInstanceLoopEvent)
        private processInstanceLoopEventRepository: Repository<ProcessInstanceLoopEvent>
    ) {}

    findOneByExecutionId(executionId: ProcessInstanceLoopEvent['executionId']) {
        return this.processInstanceLoopEventRepository.findOne({
            where: { executionId },
            relations: ['processInstance'],
        });
    }
}
