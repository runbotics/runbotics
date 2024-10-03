import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProcessInstance } from './process-instance.entity';
import { MoreThan, Repository } from 'typeorm';
import {
    IBot,
    IProcess,
    ProcessInstanceStatus,
    Tenant,
} from 'runbotics-common';
import { Logger } from '#/utils/logger';
import { CreateProcessInstanceDto } from './dto/create-process-instance.dto';
import { UpdateProcessInstanceDto } from './dto/update-process-instance.dto';

const relations = ['bot', 'process', 'user', 'trigger'];

@Injectable()
export class ProcessInstanceService {
    private readonly logger = new Logger(ProcessInstanceService.name);

    constructor(
        @InjectRepository(ProcessInstance)
        private readonly processInstanceRepository: Repository<ProcessInstance>
    ) {}

    create(processInstanceDto: CreateProcessInstanceDto) {
        const newProcessInstance =
            this.processInstanceRepository.create(processInstanceDto);

        return this.processInstanceRepository.save(newProcessInstance);
    }

    async update(
        id: ProcessInstance['id'],
        processInstanceDto: UpdateProcessInstanceDto
    ) {
        await this.processInstanceRepository
            .findOneByOrFail({ id })
            .catch(() => {
                throw new BadRequestException(
                    `Cannot find process instance with provided id ${id}`
                );
            });

        return this.processInstanceRepository.update(id, processInstanceDto);
    }

    findAll(tenantId: Tenant['id']) {
        return this.processInstanceRepository.find({
            where: { process: { tenantId } },
            relations,
        });
    }

    findOneById(id: ProcessInstance['id']) {
        return this.processInstanceRepository.findOne({
            where: { id },
            relations,
        });
    }

    findAllByBotId(id: IBot['id'], tenantId: Tenant['id']) {
        return this.processInstanceRepository.find({
            where: {
                bot: { id },
                process: { tenantId },
            },
            relations,
        });
    }

    findAllActiveByBotId(id: IBot['id']) {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return this.processInstanceRepository.find({
            where: {
                bot: { id },
                status: ProcessInstanceStatus.IN_PROGRESS,
                created: MoreThan(date.toISOString()),
            },
            relations,
        });
    }

    findAllByProcessId(id: IProcess['id'], tenantId: Tenant['id']) {
        return this.processInstanceRepository.find({
            where: {
                process: { id, tenantId },
            },
            relations,
        });
    }

    async delete(id: ProcessInstance['id']) {
        await this.processInstanceRepository
            .findOneByOrFail({ id })
            .catch(() => {
                throw new BadRequestException(
                    `Cannot find process instance with provided id ${id}`
                );
            });

        await this.processInstanceRepository.delete(id);
    }
}
