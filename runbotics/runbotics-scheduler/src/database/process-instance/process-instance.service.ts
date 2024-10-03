// import {Injectable} from '@nestjs/common';
// import {InjectRepository} from '@nestjs/typeorm';
// import {Repository, MoreThan} from 'typeorm';
// import {ProcessInstanceEntity} from './process-instance.entity';
// import {IProcessInstance, ProcessInstanceStatus} from 'runbotics-common';

// const relations = ['bot', 'process', 'user', 'trigger'];

// @Injectable()
// export class ProcessInstanceService {
//     constructor(
//         @InjectRepository(ProcessInstanceEntity)
//         private processInstanceRepository: Repository<ProcessInstanceEntity>,
//     ) {}

//     findById(id: string): Promise<IProcessInstance> {
//         return this.processInstanceRepository.findOne({ where: { id }, relations });
//     }

//     findAllByBotId(id: number): Promise<IProcessInstance[]> {
//         return this.processInstanceRepository.find({ where: { bot: { id } } });
//     }

//     findActiveByBotId(id: number): Promise<IProcessInstance[]> {
//         const date = new Date();
//         date.setDate(date.getDate() - 7);
//         return this.processInstanceRepository.find({
//             where: {
//                 bot: { id },
//                 status: ProcessInstanceStatus.IN_PROGRESS,
//                 created: MoreThan(date.toISOString())
//             },
//             relations
//         });
//     }

//     save(process: IProcessInstance) {
//         return this.processInstanceRepository.save(process);
//     }

//     findAll(): Promise<IProcessInstance[]> {
//         return this.processInstanceRepository.find({ relations });
//     }

//     delete(id: IProcessInstance['id']) {
//         return this.processInstanceRepository.delete(id);
//     }
// }