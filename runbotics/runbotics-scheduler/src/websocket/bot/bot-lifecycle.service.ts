import { Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { IBot, IProcessInstance, IProcessInstanceEvent, ProcessInstanceEventStatus, ProcessInstanceStatus } from 'runbotics-common';

import { Logger } from '#/utils/logger';

import { BotProcessEventService } from './process-launch/bot-process-instance-event.service';
import { BotProcessService } from './process-launch/bot-process-instance.service';
import { Connection } from 'typeorm';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { UpdateProcessInstanceDto } from '#/scheduler-database/process-instance/dto/update-process-instance.dto';
import { ProcessInstanceEventService } from '#/scheduler-database/process-instance-event/process-instance-event.service';

@Injectable()
export class BotLifecycleService {
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly processInstanceEventService: ProcessInstanceEventService,
        private readonly botProcessEventService: BotProcessEventService,
        private readonly botProcessService: BotProcessService,
        private readonly connection: Connection,
    ) { }

    private readonly logger = new Logger(BotLifecycleService.name);

    async handleProcessInstanceInterruption(bot: IBot): Promise<void> {
        const disconnectedInstances =
            await this.processInstanceService.findAllActiveByBotId(bot.id)
                .catch(() => {
                    this.logger.error(`Not found process-instances for bot (${bot.id})`);
                    throw new NotFoundException(`Not found process-instances for bot (${bot.id})`);
                });

        if(disconnectedInstances.length === 0) return;

        await Promise.all(disconnectedInstances.map(async (disconnectedInstance) => {
            if (
                disconnectedInstance.status !== ProcessInstanceStatus.INITIALIZING &&
                disconnectedInstance.status !== ProcessInstanceStatus.IN_PROGRESS
            ) return;

            const newProcessInstance: UpdateProcessInstanceDto = {
                status: ProcessInstanceStatus.ERRORED,
                error: 'Bot has been shut down',
                updated: dayjs().toISOString(),
            };

            await this.updateInterruptedProcessInstance(newProcessInstance);
            await this.handleProcessInstanceEventInterruption(newProcessInstance);
            await this.processInstanceService.update(
                disconnectedInstance.id,
                newProcessInstance
            );
        }));
    }

    private async handleProcessInstanceEventInterruption (processInstance: IProcessInstance): Promise<void> {
        const activeEvents = await this.processInstanceEventService
            .findAllActiveByProcessInstanceId(processInstance.id);

        if(!activeEvents) return;

        await activeEvents.forEach(async event => {
            const newProcessInstanceEvent: IProcessInstanceEvent = {
                ...event,
                status: ProcessInstanceEventStatus.ERRORED,
                error: 'Bot has been shut down',
                finished: processInstance.updated,
                processInstance,
            };
            await this.updateInterruptedProcessInstanceEvent(newProcessInstanceEvent, processInstance);
        });
    }

    private async updateInterruptedProcessInstance(processInstance: IProcessInstance) {
        this.logger.log(`Updating interrupted process-instance (${processInstance.id}) after bot disconnection | status: ${processInstance.status}`);
        await this.botProcessService.handleAdditionalProcessInstanceInfos(processInstance);
        this.logger.log(`Success interrupted process-instance (${processInstance.id}) updated | status: ${processInstance.status}`);
    }

    private async updateInterruptedProcessInstanceEvent(
        processInstanceEvent: IProcessInstanceEvent, processInstance: IProcessInstance
    ) {
        this.logger.log(`Updating interrupted process-instance-event (${processInstanceEvent.id}) | status: ${processInstanceEvent.status}`);
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.botProcessEventService.updateProcessInstanceEventParams(queryRunner, processInstanceEvent, processInstance);
            await queryRunner.commitTransaction();
        } catch (err: unknown) {
            this.logger.error(
                'Process instance event update error: rollback',
                err
            );
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        this.logger.log(`Success interrupted process-instance-event (${processInstanceEvent.id}) updated | status: ${processInstanceEvent.status}`);
    }
}
