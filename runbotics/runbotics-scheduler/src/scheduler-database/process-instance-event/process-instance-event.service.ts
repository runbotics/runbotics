import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, Repository } from 'typeorm';
import { ProcessInstanceEvent } from './process-instance-event.entity';
import { ProcessInstanceEventStatus } from 'runbotics-common';
import { ProcessInstance } from '../process-instance/process-instance.entity';
import { UserEntity } from '#/database/user/user.entity';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage, Page } from '#/utils/page/page';

const RELATIONS: FindOptionsRelations<ProcessInstanceEvent> = {
    processInstance: {
        process: true,
    },
};

@Injectable()
export class ProcessInstanceEventService {
    constructor(
        @InjectRepository(ProcessInstanceEvent)
        private processInstanceEventRepository: Repository<ProcessInstanceEvent>
    ) {}

    async getPage(
        user: UserEntity,
        specs: Specs<ProcessInstanceEvent>,
        paging: Paging
    ): Promise<Page<ProcessInstanceEvent>> {
        const options: FindManyOptions<ProcessInstanceEvent> = {
            ...paging,
            ...specs,
        };

        options.relations = RELATIONS;
        options.where = {
            ...options.where,
            processInstance: {
                process: {
                    tenantId: user.tenantId,
                },
            },
        };

        const processInstanceEventPage = await getPage(
            this.processInstanceEventRepository,
            options
        );

        return processInstanceEventPage;
    }

    async getOne(id: ProcessInstanceEvent['id'], user: UserEntity) {
        const processInstanceEvent = await this.processInstanceEventRepository
            .findOneOrFail({
                where: {
                    id,
                    processInstance: {
                        process: {
                            tenantId: user.tenantId,
                        },
                    },
                },
                relations: RELATIONS,
            })
            .catch(() => {
                throw new NotFoundException(
                    `Could not find process instance event with id ${id}`
                );
            });

        return processInstanceEvent;
    }

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
