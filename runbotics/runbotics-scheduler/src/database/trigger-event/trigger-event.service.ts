// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ITriggerEvent, TriggerEvent } from 'runbotics-common';

// import { TriggerEventEntity } from './trigger-event.entity';

// @Injectable()
// export class TriggerEventService {
//     constructor(
//         @InjectRepository(TriggerEventEntity)
//         private processTriggerRepository: Repository<TriggerEventEntity>,
//     ) {}

//     findByName(name: TriggerEvent): Promise<ITriggerEvent> {
//         return this.processTriggerRepository.findOne({ where: { name } });
//     }
// }
