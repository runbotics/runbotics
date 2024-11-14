import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, QueryRunner, Repository } from 'typeorm';
import { ProcessInstanceLoopEvent } from './process-instance-loop-event.entity';
import { UserEntity } from '#/database/user/user.entity';
import { Logger } from '#/utils/logger';

const RELATIONS: FindOptionsRelations<ProcessInstanceLoopEvent> = {
    processInstance: {
        process: true,
    },
};

@Injectable()
export class ProcessInstanceLoopEventService {
    private readonly logger = new Logger(ProcessInstanceLoopEventService.name);

    constructor(
        @InjectRepository(ProcessInstanceLoopEvent)
        private processInstanceLoopEventRepository: Repository<ProcessInstanceLoopEvent>
    ) {}

    async getLoopEvents(
        loopId: ProcessInstanceLoopEvent['loopId'],
        user: UserEntity
    ) {
        const processInstanceLoopEvents =
            await this.processInstanceLoopEventRepository.find({
                where: {
                    loopId,
                    processInstance: {
                        process: {
                            tenantId: user.tenantId,
                        },
                    },
                },
                relations: RELATIONS,
            });

        return processInstanceLoopEvents;
    }

    findOneByExecutionId(
        queryRunner: QueryRunner,
        executionId: ProcessInstanceLoopEvent['executionId']
    ) {
        return queryRunner.manager.findOne(ProcessInstanceLoopEvent, {
            where: { executionId },
            relations: RELATIONS,
        });
    }
}
