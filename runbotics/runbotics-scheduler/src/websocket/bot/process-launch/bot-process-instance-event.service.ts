import { Injectable } from '@nestjs/common';
import { Logger } from '../../../utils/logger';
import { ProcessInstanceEventService } from '../../../database/process-instance-event/process-instance-event.service';
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
import { ProcessInstanceEventEntity } from '#/database/process-instance-event/process-instance-event.entity';
import { ProcessInstanceEntity } from '#/database/process-instance/process-instance.entity';
import { ProcessInstanceLoopEventEntity } from '#/database/process-instance-loop-event/process-instance-loop-event.entity';

const COMPLETED_UPDATE_FIELDS = [
    'status',
    'finished',
    'output',
    'log',
    'error',
];
const STARTED_UPDATE_FIELDS = ['input', 'created'];

function hasWarning(processInstanceEvent: IProcessInstanceEvent): boolean {
    return processInstanceEvent.step === ProcessInstanceStep.WARNING;
}

@Injectable()
export class BotProcessEventService {
    private readonly logger = new Logger(BotProcessEventService.name);

    constructor(
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly connection: Connection,
        private readonly uiGateway: UiGateway
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
                    processInstanceEvent.status ===
                        ProcessInstanceEventStatus.IN_PROGRESS
                        ? STARTED_UPDATE_FIELDS
                        : COMPLETED_UPDATE_FIELDS,
                    ['execution_id']
                )
                .execute();

            await this.updateProcessInstance(queryRunner, processInstanceEvent);

            await queryRunner.commitTransaction();

            const updatedProcessInstanceEvent =
                await this.processInstanceEventService.findByExecutionId(
                    queryRunner,
                    processInstanceEvent.executionId
                );

            const isStatusInProgress =
                processInstanceEvent.status ===
                ProcessInstanceEventStatus.IN_PROGRESS;
            const hasUpdatedStatus =
                updatedProcessInstanceEvent.status ===
                    ProcessInstanceEventStatus.COMPLETED ||
                updatedProcessInstanceEvent.status ===
                    ProcessInstanceEventStatus.ERRORED;
            const hasProcessInstanceEventChanged = !(
                isStatusInProgress && hasUpdatedStatus
            );

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
        } catch (err: any) {
            this.logger.error(
                'Process instance event update error: rollback',
                err
            );
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
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
                .into(ProcessInstanceLoopEventEntity)
                .values(processInstanceEvent)
                .orUpdate(
                    processInstanceEvent.status ===
                        ProcessInstanceEventStatus.IN_PROGRESS
                        ? STARTED_UPDATE_FIELDS
                        : COMPLETED_UPDATE_FIELDS,
                    ['execution_id']
                )
                .execute();
            await this.updateProcessInstance(queryRunner, processInstanceEvent);
            await queryRunner.commitTransaction();

            // const updatedProcessInstanceEvent =
            //     await this.processInstanceLoopEventService.findByExecutionId(
            //         queryRunner,
            //         processInstanceEvent.executionId
            //     );
            // Currently we don't want to send loop events to the UI
            // if (
            //     updatedProcessInstanceEvent.processInstance
            //         .rootProcessInstanceId === null
            // ) {
            //     this.uiGateway.server.emit(
            //         WsMessage.PROCESS_INSTANCE_EVENT,
            //         updatedProcessInstanceEvent
            //     );
            // }
        } catch (err: any) {
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
        processInstanceEvent: IProcessInstanceEvent
    ) {
        const processInstance = await queryRunner.manager.findOne(
            ProcessInstanceEntity,
            { where: { id: processInstanceEvent.processInstance.id } }
        );

        if (processInstance) {
            await queryRunner.manager
                .createQueryBuilder()
                .update(ProcessInstanceEntity)
                .set({
                    error: processInstanceEvent.error,
                    step: processInstanceEvent.step,
                    ...(hasWarning(processInstanceEvent) && { warning: true })
                })
                .where('id = :id', { id: processInstance.id })
                .execute();
        }
    }
}
