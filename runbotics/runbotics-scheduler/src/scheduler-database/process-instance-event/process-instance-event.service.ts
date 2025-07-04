import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    FindManyOptions,
    FindOptionsRelations,
    QueryRunner,
    Repository,
} from 'typeorm';
import { ProcessInstanceEvent } from './process-instance-event.entity';
import { ProcessInstanceEventStatus } from 'runbotics-common';
import { ProcessInstance } from '../process-instance/process-instance.entity';
import { User } from '#/scheduler-database/user/user.entity';
import { Specs } from '#/utils/specification/specifiable.decorator';
import { Paging } from '#/utils/page/pageable.decorator';
import { getPage, Page } from '#/utils/page/page';
import { Logger } from '#/utils/logger';

const RELATIONS: FindOptionsRelations<ProcessInstanceEvent> = {
    processInstance: {
        process: true,
    },
};

@Injectable()
export class ProcessInstanceEventService {
    private readonly logger = new Logger(ProcessInstanceEventService.name);

    constructor(
        @InjectRepository(ProcessInstanceEvent)
        private processInstanceEventRepository: Repository<ProcessInstanceEvent>
    ) {}

    async getPage(
        user: User,
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

    async getOne(id: ProcessInstanceEvent['id'], user: User) {
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

    findOneByExecutionId(
        queryRunner: QueryRunner,
        executionId: ProcessInstanceEvent['executionId']
    ) {
        return queryRunner.manager.findOne(ProcessInstanceEvent, {
            where: { executionId },
            relations: RELATIONS,
        });
    }

    async findAllByProcessInstanceId(processInstanceId: ProcessInstance['id']) {
        return this.processInstanceEventRepository.find({
            where: {
                processInstance: {id: processInstanceId}
            },
            relations: RELATIONS,
        });
    }
    
    findAllActiveByProcessInstanceId(processInstanceId: ProcessInstance['id']) {
        return this.processInstanceEventRepository.find({
            where: {
                processInstance: { id: processInstanceId },
                status: ProcessInstanceEventStatus.IN_PROGRESS,
            },
        });
    }
}
