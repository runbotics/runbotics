import { Injectable, NotFoundException } from '@nestjs/common';
import { BotStatus, IBot, IProcessInstance, isEmailTriggerData, ProcessInstanceNotification, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { Connection } from 'typeorm';
import Axios from 'axios';

import { Logger } from '#/utils/logger';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { MailTriggerService } from '#/mail-trigger/mail-trigger.service';
import { ProcessFileService } from '#/queue/process/process-file.service';
import { NotificationService } from '#/microsoft/notification';

import { UiGateway } from '../../ui/ui.gateway';
import { getProcessInstanceUpdateFieldsByStatus, isProcessInstanceFinished } from './bot-process-instance.service.utils';
import { ProcessInstance } from '#/scheduler-database/process-instance/process-instance.entity';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';

@Injectable()
export class BotProcessService {
    private readonly logger = new Logger(BotProcessService.name);

    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly connection: Connection,
        private readonly uiGateway: UiGateway,
        private readonly mailTriggerService: MailTriggerService,
        private readonly processFileService: ProcessFileService,
        private readonly notificationService: NotificationService,
    ) {}

    async updateProcessInstance(installationId: string, processInstance: IProcessInstance) {
        const instanceToSave = this.setPropertiesFromProcessInstance(processInstance);
        const { newProcessInstance, bot } = await this.setBotInProcessInstance(instanceToSave, installationId);

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const updatedLastInstanceRunTime = await this.updateProcessParams(processInstance, newProcessInstance, bot);
            const dbProcessInstance = await queryRunner.manager.findOne(ProcessInstance, { where: { id: updatedLastInstanceRunTime.id } });

            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into(ProcessInstance)
                .values({ ...updatedLastInstanceRunTime })
                .orUpdate(getProcessInstanceUpdateFieldsByStatus(updatedLastInstanceRunTime.status, dbProcessInstance?.status), ['id'])
                .execute();

            await queryRunner.commitTransaction();

            const updatedProcessInstance =
                await this.processInstanceService.findOneById(processInstance.id);

            if (!processInstance.rootProcessInstanceId) {
                this.uiGateway.server.emit(WsMessage.PROCESS, updatedProcessInstance);
            }

            if (!processInstance.rootProcessInstanceId && isProcessInstanceFinished(processInstance.status)) {
                if (isEmailTriggerData(processInstance.triggerData) && processInstance.triggerData.emailId)
                    await this.notificationService.sendProcessResultMail(processInstance);
                else
                    await this.mailTriggerService.sendProcessResultMail(processInstance);
            }

            if (isProcessInstanceFinished(processInstance.status)) {
                await this.processFileService.deleteTempFiles(processInstance.orchestratorProcessInstanceId);
            }
        } catch (err: unknown) {
            this.logger.error('Process instance update error: rollback', err);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async handleAdditionalProcessInstanceInfos(processInstance: IProcessInstance) {
        if (!processInstance.rootProcessInstanceId) {
            this.uiGateway.server.emit(WsMessage.PROCESS, processInstance);
        }
        if (isProcessInstanceFinished(processInstance.status)) {
            await this.processFileService.deleteTempFiles(processInstance.orchestratorProcessInstanceId);
        }
        await this.updateProcessLastRunTime(processInstance);
    }

    async updateProcessLastRunTime(processInstance: IProcessInstance) {
        if (!processInstance?.process?.id) return;
        const process = await this.processService.findById(processInstance.process.id);

        if (process && processInstance.created) {
            await this.processService.partialUpdate({ id: process.id, lastRun: processInstance.created });
        }
    }

    async notifyAboutProcessInstanceStatus(processInstance: IProcessInstance) {
        const statusList = [
            ProcessInstanceStatus.IN_PROGRESS,
            ProcessInstanceStatus.COMPLETED,
            ProcessInstanceStatus.TERMINATED,
            ProcessInstanceStatus.ERRORED,
        ];

        if (statusList.includes(processInstance.status)) {
            const processInstanceNotification: ProcessInstanceNotification = {
                processId: processInstance?.process?.id,
                processInstanceId: processInstance?.id,
                status: processInstance?.status,
                input: processInstance?.input,
                output: processInstance?.output,
                started: processInstance?.created,
                finished: processInstance?.updated,
                error: processInstance?.error,
            };

            await Axios.post(processInstance?.callbackUrl, processInstanceNotification);
        }
    }

    private setPropertiesFromProcessInstance(processInstance: IProcessInstance) {
        const instanceToSave = new ProcessInstance();
        if (processInstance.created) {
            instanceToSave.created = processInstance.created;
        }
        instanceToSave.rootProcessInstanceId = processInstance.rootProcessInstanceId;
        if (isProcessInstanceFinished(processInstance.status)) {
            instanceToSave.updated = processInstance.updated;
        }
        instanceToSave.id = processInstance.id;
        instanceToSave.status = processInstance.status;
        instanceToSave.error = processInstance.error;
        instanceToSave.processId = processInstance.process.id;
        instanceToSave.orchestratorProcessInstanceId = processInstance.orchestratorProcessInstanceId;
        instanceToSave.userId = processInstance.user.id;
        instanceToSave.trigger = processInstance.trigger;
        instanceToSave.triggerData = processInstance.triggerData;
        instanceToSave.parentProcessInstanceId = processInstance.parentProcessInstanceId;

        return { ...instanceToSave, user: processInstance.user };
    }

    private async setBotInProcessInstance(
        processInstance: IProcessInstance,
        installationId: string
    ) {
        const bot = await this.botService.findByInstallationId(installationId)
            .catch(() => {
                this.logger.error(`Bot ${installationId} not found`);
                throw new NotFoundException(`Bot ${installationId} not found`);
            });
        const newProcessInstance = { ...processInstance };
        newProcessInstance.bot = bot;

        return await this.setPropertiesFromDatabase(newProcessInstance);
    }

    private async setPropertiesFromDatabase(instanceToSave: IProcessInstance) {
        const newProcessInstance = { ...instanceToSave };
        const dbProcessInstance =
            await this.processInstanceService.findOneById(instanceToSave.id);
        if (dbProcessInstance) {
            newProcessInstance.user = dbProcessInstance.user;
        }
        return { newProcessInstance, bot: newProcessInstance.bot };
    }

    private async updateProcessParams(
        processInstance: IProcessInstance,
        instanceToSave: IProcessInstance,
        bot: IBot,
    ) {
        const newProcessInstance = {...instanceToSave};

        const newBot = {...bot};
        if (processInstance.status === ProcessInstanceStatus.IN_PROGRESS) {
            newBot.status = BotStatus.BUSY;
            newProcessInstance.input = processInstance.input;
        } else if (processInstance.status === ProcessInstanceStatus.INITIALIZING) {
            await this.updateProcessLastRunTime(processInstance);
        } else if (isProcessInstanceFinished(processInstance.status)) {
            newProcessInstance.output = processInstance.output;
            if(!newProcessInstance.rootProcessInstanceId && bot.status !== BotStatus.DISCONNECTED) {
                newBot.status = BotStatus.CONNECTED;
            }
        }
        if (!newProcessInstance.rootProcessInstanceId) {
            await this.botService.save(newBot);
            this.uiGateway.server.emit(WsMessage.BOT_STATUS, newBot);
        }
        return newProcessInstance;
    }
}
