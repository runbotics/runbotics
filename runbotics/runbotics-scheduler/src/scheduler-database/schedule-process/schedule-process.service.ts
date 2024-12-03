import { ProcessService } from '#/scheduler-database/process/process.service';
import { Logger } from '#/utils/logger';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScheduleProcess } from './schedule-process.entity';
import { CreateScheduleProcessDto } from './dto/create-schedule-process.dto';
import { User } from '#/scheduler-database/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueService } from '#/queue/queue.service';
import { TriggerEvent } from 'runbotics-common';
import dayjs from 'dayjs';

const relations = ['process', 'user', 'process.system', 'process.botCollection'];

@Injectable()
export class ScheduleProcessService {
    private readonly logger = new Logger(ScheduleProcessService.name);

    constructor(
        @InjectRepository(ScheduleProcess)
        private readonly scheduleProcessRepository: Repository<ScheduleProcess>,
        private readonly processService: ProcessService,
        @Inject(forwardRef(() => QueueService))
        private readonly queueService: QueueService,
    ) { }

    getAll() {
        return this.scheduleProcessRepository.find({ relations });
    }

    getAllByProcessId(processId: number, tenantId: string) {
        return this.scheduleProcessRepository.findBy({
            process: { tenantId, id: processId }
        });
    }

    getByIdAndTenantId(id: number, tenantId: string) {
        return this.scheduleProcessRepository.findOneBy({
            id, process: { tenantId }
        });
    }

    getById(id: number) {
        return this.scheduleProcessRepository.findOne({ where: { id }, relations });
    }

    async create(scheduleProcessDto: CreateScheduleProcessDto, user: User) {
        const process = await this.processService
            .findByIdAndTenantId(scheduleProcessDto.process.id, user.tenantId)
            .catch(() => {
                throw new BadRequestException('Cannot find process');
            });

        await this.processService.partialUpdate({
            id: process.id,
            updated: dayjs().toISOString(),
        });

        const newScheduleProcess = new ScheduleProcess();
        newScheduleProcess.cron = scheduleProcessDto.cron;
        newScheduleProcess.inputVariables = scheduleProcessDto.inputVariables;
        newScheduleProcess.user = user;
        newScheduleProcess.process = process;

        const scheduleProcess = await this.scheduleProcessRepository.save(newScheduleProcess);

        const orchestratorProcessInstanceId = randomUUID();
        await this.queueService.createScheduledJob({
            ...scheduleProcess,
            orchestratorProcessInstanceId,
            trigger: { name: TriggerEvent.SCHEDULER },
            triggerData: { userEmail: user.email },
            input: { variables: scheduleProcess?.inputVariables ? JSON.parse(scheduleProcess.inputVariables) : null }
        });

        delete scheduleProcess.process;
        delete scheduleProcess.user;

        return scheduleProcess;
    }

    async delete(id: number) {
        const scheduleProcess = await this.scheduleProcessRepository
            .findOneOrFail({ where: { id }, relations }).catch(() => {
                throw new BadRequestException('Cannot find schedule process with provided id');
            });

        await this.processService.partialUpdate({
            id: scheduleProcess.process.id,
            updated: dayjs().toISOString(),
        });

        await this.scheduleProcessRepository.delete(id);
        await this.queueService.deleteScheduledJob(id);
    }
}
