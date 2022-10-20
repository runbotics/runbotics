import { Injectable } from '@nestjs/common';
import { Logger } from '../../utils/logger';
import { ProcessInstanceEventService } from '../../database/process-instance-event/process-instance-event.service';
import {
    IBot,
    IProcessInstance,
    IProcessInstanceEvent,
    ProcessInstanceEventStatus,
    ProcessInstanceStatus,
    WsMessage,
} from 'runbotics-common';
import { Connection, QueryRunner } from 'typeorm';
import { UiGateway } from '../gateway/ui.gateway';
import { ProcessInstanceEventEntity } from 'src/database/process-instance-event/process-instance-event.entity';
import { ProcessInstanceEntity } from 'src/database/process-instance/process-instance.entity';

const COMPLETED_UPDATE_FIELDS = [
    'status',
    'finished',
    'output',
    'log',
    'error',
];
const STARTED_UPDATE_FIELDS = ['input', 'created'];

@Injectable()
export class BotProcessEventService {
    private readonly logger = new Logger(BotProcessEventService.name);

    constructor(
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly connection: Connection,
        private readonly uiGateway: UiGateway
    ) {
    }

    async updateProcessInstanceEvent(
        processInstanceEvent: IProcessInstanceEvent,
        bot: IBot
    ) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(ProcessInstanceEntity)
                .values({
                    ...processInstanceEvent.processInstance,
                    status: ProcessInstanceStatus.INITIALIZING,
                    bot,
                } as IProcessInstance)
                .orIgnore()
                .execute();

            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(ProcessInstanceEventEntity)
                .values(processInstanceEvent)
                .orUpdate(
                    processInstanceEvent.status === ProcessInstanceEventStatus.IN_PROGRESS
                        ? STARTED_UPDATE_FIELDS
                        : COMPLETED_UPDATE_FIELDS,
                    ['execution_id']
                )
                .execute();
            await this.updateProcessInstance(queryRunner, processInstanceEvent);
            await queryRunner.commitTransaction();

            const updatedProcessInstanceEvent = await this.processInstanceEventService
                .findByExecutionId(queryRunner, processInstanceEvent.executionId);

            if (updatedProcessInstanceEvent.processInstance.rootProcessInstanceId === null) {
                this.uiGateway.server.emit(
                    WsMessage.PROCESS_INSTANCE_EVENT,
                    updatedProcessInstanceEvent
                );
            }
        } catch (err) {
            this.logger.error('Process instance event update error: rollback', err);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async updateProcessInstance(
        queryRunner: QueryRunner,
        processInstanceEvent: IProcessInstanceEvent
    ) {
        const processInstance = await queryRunner.manager
            .findOne(ProcessInstanceEntity, processInstanceEvent.processInstance.id);

        if (processInstance) {
            await queryRunner.manager
                .createQueryBuilder()
                .update(ProcessInstanceEntity)
                .set({
                    error: processInstanceEvent.error,
                    step: processInstanceEvent.step,
                })
                .where('id = :id', { id: processInstance.id })
                .execute();
        }
    }
}
