// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { QueryRunner, Repository } from 'typeorm';
// import { ProcessInstanceEventEntity } from './process-instance-event.entity';
// import { IProcessInstanceEvent, ProcessInstanceEventStatus } from 'runbotics-common';

// @Injectable()
// export class ProcessInstanceEventService {
//     constructor(
//         @InjectRepository(ProcessInstanceEventEntity)
//         private processInstanceEventRepository: Repository<ProcessInstanceEventEntity>,
//     ) { }

//     async save(event: IProcessInstanceEvent) {
//         await this.processInstanceEventRepository.save(event);
//         return event;
//     }

//     update(event: IProcessInstanceEvent) {
//         return this.processInstanceEventRepository.update(event.id, event);
//     }

//     findByExecutionId(queryRunner: QueryRunner, executionId: string) {
//         return queryRunner.manager.findOne(ProcessInstanceEventEntity, { where: { executionId }, relations: ['processInstance'] });
//     }

//     findActiveByProcessInstanceId(processInstanceId: string): Promise<IProcessInstanceEvent[]> {
//         return this.processInstanceEventRepository.findBy({ 
//             processInstance: { id: processInstanceId },
//             status: ProcessInstanceEventStatus.IN_PROGRESS,
//         });
//     }
// }
