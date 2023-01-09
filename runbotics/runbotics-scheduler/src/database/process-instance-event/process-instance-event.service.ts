import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { ProcessInstanceEventEntity } from './process-instance-event.entity';
import { IProcessInstanceEvent } from 'runbotics-common';

@Injectable()
export class ProcessInstanceEventService {
    constructor(
        @InjectRepository(ProcessInstanceEventEntity)
        private processInstanceEventRepository: Repository<ProcessInstanceEventEntity>,
    ) { }

    async save(event: IProcessInstanceEvent) {
        await this.processInstanceEventRepository.save(event);
        return event;
    }

    findByExecutionId(queryRunner: QueryRunner, executionId: string) {
        return queryRunner.manager.findOne(ProcessInstanceEventEntity, { where: { executionId }, relations: ['processInstance'] });
    }
}
