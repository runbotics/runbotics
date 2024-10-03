import { Logger } from '../../../utils/logger';
import {
    IBot,
    IProcessInstance,
    IProcessInstanceEvent,
    IProcessInstanceLoopEvent,
    ProcessInstanceEventStatus,
    ProcessInstanceStatus,
    WsMessage,
    ProcessInstanceStep,
} from 'runbotics-common';
import { Connection, QueryRunner } from 'typeorm';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { Injectable } from '@nestjs/common';
import { isInstanceInterrupted } from './bot-process-instance.service.utils';
import { ProcessInstance } from '#/scheduler-database/process-instance/process-instance.entity';
import { ProcessInstanceEventService } from '#/scheduler-database/process-instance-event/process-instance-event.service';
import { ProcessInstanceEvent } from '#/scheduler-database/process-instance-event/process-instance-event.entity';
import { ProcessInstanceLoopEventService } from '#/scheduler-database/process-instance-loop-event/process-instance-loop-event.service';
import { ProcessInstanceLoopEvent } from '#/scheduler-database/process-instance-loop-event/process-instance-loop-event.entity';

const COMPLETED_UPDATE_FIELDS = [
    'status',
    'finished',
    'output',
    'log',
    'error',
];
const STARTED_UPDATE_FIELDS = ['input', 'created'];

function hasWarning(processInstanceEvent: IProcessInstanceEvent): boolean {
    return processInstanceEvent.step === ProcessInstanceStep.ERROR_BOUNDARY;
}

@Injectable()
export class BotProcessEventService {
    private readonly logger = new Logger(BotProcessEventService.name);

    constructor(
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly processInstanceLoopEventService: ProcessInstanceLoopEventService,
        private readonly connection: Connection,
        private readonly uiGateway: UiGateway,
    ) {}

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
                .into(ProcessInstance)
                .values({
                    ...processInstanceEvent.processInstance,
                    status: ProcessInstanceStatus.INITIALIZING,
                    bot,
                } as IProcessInstance)
                .orIgnore()
                .execute();

            const processInstance =
                await queryRunner.manager
                .findOne(
                    ProcessInstance,
                    { where: { id: processInstanceEvent.processInstance.id } }
                )
                .catch(error => {
                    this.logger.error(`process-instance (${processInstanceEvent.processInstance.id}) not found | Error: ${error});`);
                    return null;
                });

            await this.updateProcessInstanceEventParams(queryRunner, processInstanceEvent, processInstance);
            await queryRunner.commitTransaction();

            const updatedProcessInstanceEvent =
                await this.processInstanceEventService.findOneByExecutionId(
                    processInstanceEvent.executionId
                );

            const isStatusInProgress =
                processInstanceEvent.status === ProcessInstanceEventStatus.IN_PROGRESS;
            const hasUpdatedStatus =
                updatedProcessInstanceEvent.status === ProcessInstanceEventStatus.COMPLETED;
            const hasProcessInstanceEventChanged = !(isStatusInProgress && hasUpdatedStatus);

            if (
                updatedProcessInstanceEvent.processInstance
                    .rootProcessInstanceId === null &&
                hasProcessInstanceEventChanged
            ) {
                this.uiGateway.server.emit(
                    WsMessage.PROCESS_INSTANCE_EVENT,
                    updatedProcessInstanceEvent
                );
            }
        } catch (err: unknown) {
            this.logger.error(
                'Process instance event update error: rollback',
                err
            );
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async updateProcessInstanceEventParams(
        queryRunner: QueryRunner, processInstanceEvent: IProcessInstanceEvent, processInstance: IProcessInstance
    ) {
        if(!processInstance) return;

        if(isInstanceInterrupted(processInstanceEvent.status, processInstance.status)) {
            const error = processInstance.error;
            const newStatus =
                processInstance.status === ProcessInstanceStatus.TERMINATED
                    ? ProcessInstanceEventStatus.TERMINATED
                    : ProcessInstanceEventStatus.ERRORED;

            const newProcessInstanceEvent = {
                ...processInstanceEvent,
                status: newStatus,
                finished: processInstance.updated,
                error,
            };

            this.upsertProcessInstanceEvent(
                queryRunner,
                newProcessInstanceEvent,
                processInstance,
                processInstanceEvent.status
            );
        } else {
            this.upsertProcessInstanceEvent(
                queryRunner,
                processInstanceEvent,
                processInstance,
                processInstanceEvent.status
            );
        }
    }

    private async upsertProcessInstanceEvent(
        queryRunner: QueryRunner,
        newProcessInstanceEvent: IProcessInstanceEvent,
        processInstance: IProcessInstance,
        originalEventStatus: ProcessInstanceEventStatus
    ) {
        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(ProcessInstanceEvent)
            .values(newProcessInstanceEvent)
            .orUpdate(
                originalEventStatus === ProcessInstanceEventStatus.IN_PROGRESS
                    ? STARTED_UPDATE_FIELDS
                    : COMPLETED_UPDATE_FIELDS,
                ['execution_id']
            )
            .execute();

        await this.updateProcessInstance(queryRunner, newProcessInstanceEvent, processInstance);
    }

    async updateProcessInstanceLoopEvent(
        processInstanceEvent: IProcessInstanceLoopEvent,
        bot: IBot
    ) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(ProcessInstance)
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
                .into(ProcessInstanceLoopEvent)
                .values(processInstanceEvent)
                .orUpdate(
                    processInstanceEvent.status === ProcessInstanceEventStatus.IN_PROGRESS
                        ? STARTED_UPDATE_FIELDS
                        : COMPLETED_UPDATE_FIELDS,
                    ['execution_id']
                )
                .execute();

            const processInstance = await queryRunner.manager.findOne(
                ProcessInstance,
                { where: { id: processInstanceEvent.processInstance.id } }
            );

            await this.updateProcessInstance(queryRunner, processInstanceEvent, processInstance);
            await queryRunner.commitTransaction();

            const updatedProcessInstanceEvent =
                await this.processInstanceLoopEventService.findOneByExecutionId(
                    processInstanceEvent.executionId
                );
            if (
                updatedProcessInstanceEvent.processInstance
                    .rootProcessInstanceId === null
            ) {
                this.uiGateway.server.emit(
                    WsMessage.PROCESS_INSTANCE_LOOP_EVENT,
                    updatedProcessInstanceEvent,
                );
            }
        } catch (err: unknown) {
            this.logger.error(
                'Process instance event update error: rollback',
                err
            );
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async updateProcessInstance(
        queryRunner: QueryRunner,
        processInstanceEvent: IProcessInstanceEvent,
        processInstance: IProcessInstance
    ) {
        if (processInstance) {
            await queryRunner.manager
                .createQueryBuilder()
                .update(ProcessInstance)
                .set({
                    error: processInstanceEvent.error,
                    step: processInstanceEvent.step,
                    ...(hasWarning(processInstanceEvent) && { warning: true })
                })
                .where('id = :id', { id: processInstance.id })
                .execute();
        }
    }

    async setEventStatusesAlikeInstance(bot: IBot, processInstance: IProcessInstance) {
        const activeEvents = await this.processInstanceEventService.findAllActiveByProcessInstanceId(processInstance.id);

        const newStatus =
            processInstance.status === ProcessInstanceStatus.TERMINATED
                ? ProcessInstanceEventStatus.TERMINATED
                : ProcessInstanceEventStatus.ERRORED;

        await activeEvents.forEach((event) => {
            const newProcessInstanceEvent: IProcessInstanceEvent = {
                ...event,
                status: newStatus,
                finished: processInstance.updated,
                processInstance,
            };

            this.logger.log(`Updating process-instance-event (${newProcessInstanceEvent.executionId}) by bot (${bot.installationId}) | step: ${newProcessInstanceEvent.step}, status: ${newProcessInstanceEvent.status}`);
            this.updateProcessInstanceEvent(newProcessInstanceEvent, bot);
            this.logger.log(`Success: process-instance-event (${newProcessInstanceEvent.executionId}) updated by bot (${bot.installationId}) | step: ${newProcessInstanceEvent.step}, status: ${newProcessInstanceEvent.status}`);
        });
    }
}
