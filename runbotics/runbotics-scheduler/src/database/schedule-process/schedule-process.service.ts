import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IProcess, IScheduleProcess } from 'runbotics-common';
import { Repository } from 'typeorm';
import { ScheduleProcessEntity } from './schedule-process.entity';

const relations = ['process', 'user', 'process.system', 'process.botCollection'];

@Injectable()
export class ScheduleProcessService {
    constructor(
        @InjectRepository(ScheduleProcessEntity)
        private scheduleProcessRepository: Repository<ScheduleProcessEntity>,
    ) {}

    findById(id: number): Promise<IScheduleProcess> {
        return this.scheduleProcessRepository.findOne({ id }, { relations });
    }

    save(scheduleProcess: ScheduleProcessEntity) {
        return this.scheduleProcessRepository.save(scheduleProcess);
    }

    delete(scheduleProcessId: number) {
        return this.scheduleProcessRepository.delete({ id: scheduleProcessId });
    }

    findAll() {
        return this.scheduleProcessRepository.find({ relations });
    }

    findAllByProcess(processId: IProcess['id']) {
        return this.scheduleProcessRepository.find({ where: { process: processId }, relations });
    }
}