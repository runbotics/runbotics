// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { QueryRunner, Repository } from 'typeorm';
// import { ProcessInstanceLoopEventEntity } from './process-instance-loop-event.entity';
// import { IProcessInstanceEvent } from 'runbotics-common';

// @Injectable()
// export class ProcessInstanceLoopEventService {
//     constructor(
//         @InjectRepository(ProcessInstanceLoopEventEntity)
//         private processInstanceLoopEventRepository: Repository<ProcessInstanceLoopEventEntity>,
//     ) { }

//     async save(event: IProcessInstanceEvent) {
//         await this.processInstanceLoopEventRepository.save(event);
//         return event;
//     }

//     findByExecutionId(queryRunner: QueryRunner, executionId: string) {
//         return queryRunner.manager.findOne(ProcessInstanceLoopEventEntity, { where: { executionId }, relations: ['processInstance'] });
//     }
// }
