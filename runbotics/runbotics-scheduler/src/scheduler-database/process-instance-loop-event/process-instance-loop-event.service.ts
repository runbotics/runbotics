import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { ProcessInstanceLoopEvent } from './process-instance-loop-event.entity';
import { UserEntity } from '#/database/user/user.entity';

const RELATIONS: FindOptionsRelations<ProcessInstanceLoopEvent> = {
    processInstance: {
        process: true,
    },
};

@Injectable()
export class ProcessInstanceLoopEventService {
    constructor(
        @InjectRepository(ProcessInstanceLoopEvent)
        private processInstanceLoopEventRepository: Repository<ProcessInstanceLoopEvent>
    ) {}

    async getOne(loopId: ProcessInstanceLoopEvent['loopId'], user: UserEntity) {
        const processInstanceLoopEvent =
            await this.processInstanceLoopEventRepository
                .findOneOrFail({
                    where: {
                        loopId,
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
                        `Could not find process instance loop event with loopId ${loopId}`
                    );
                });

        return processInstanceLoopEvent;
    }

    findOneByExecutionId(executionId: ProcessInstanceLoopEvent['executionId']) {
        return this.processInstanceLoopEventRepository.findOne({
            where: { executionId },
            relations: ['processInstance'],
        });
    }
}
