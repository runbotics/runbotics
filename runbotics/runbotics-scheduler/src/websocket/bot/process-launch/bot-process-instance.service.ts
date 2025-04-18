import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import Axios from 'axios';
import { BotStatus, IBot, IProcessInstance, isEmailTriggerData, ProcessInstanceNotification, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { DataSource, EntityManager } from 'typeorm';

import { MailTriggerService } from '#/mail-trigger/mail-trigger.service';
import { NotificationService } from '#/microsoft/notification';
import { ProcessFileService } from '#/queue/process/process-file.service';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { ProcessService } from '#/scheduler-database/process/process.service';
import { Logger } from '#/utils/logger';

import { ProcessInstance } from '#/scheduler-database/process-instance/process-instance.entity';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { UiGateway } from '../../ui/ui.gateway';
import { getProcessInstanceUpdateFieldsByStatus, isProcessInstanceFinished } from './bot-process-instance.service.utils';

@Injectable()
export class BotProcessService {
    private readonly logger = new Logger(BotProcessService.name);

    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly dataSource: DataSource,
        private readonly uiGateway: UiGateway,
        private readonly mailTriggerService: MailTriggerService,
        private readonly processFileService: ProcessFileService,
        private readonly notificationService: NotificationService,
    ) {}

    async updateProcessInstance(installationId: string, processInstance: IProcessInstance) {
        const instanceToSave = this.setPropertiesFromProcessInstance(processInstance);
        
        try {
            await this.dataSource.transaction(async (txEntityManager) => {
                const { newProcessInstance, bot } = await this.setBotInProcessInstance(instanceToSave, installationId, txEntityManager);
                const updatedLastInstanceRunTime = await this.updateProcessParams(processInstance, newProcessInstance, bot, txEntityManager);
                const dbProcessInstance = await txEntityManager.findOne(ProcessInstance, { where: { id: updatedLastInstanceRunTime.id } });
                    
                await txEntityManager.createQueryBuilder()
                    .insert()
                    .into(ProcessInstance)
                    .values({ ...updatedLastInstanceRunTime })
                    .orUpdate(getProcessInstanceUpdateFieldsByStatus(updatedLastInstanceRunTime.status, dbProcessInstance?.status), ['id'])
                    .execute();
            })
        } catch (err) {
            this.logger.error('Process instance update error:', err);
            throw new InternalServerErrorException();
        }
    }

    async updateProcessInstanceAndNotify(installationId: string, processInstance: IProcessInstance) {
        try {
            await this.updateProcessInstance(installationId, processInstance);

            const updatedProcessInstance =
                await this.processInstanceService.findOneById(processInstance.id);

            if (!processInstance.rootProcessInstanceId) {
                const tenantRoom = updatedProcessInstance.process.tenantId;
                this.uiGateway.emitTenant(tenantRoom, WsMessage.PROCESS, updatedProcessInstance);
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
        } catch (err) {
            this.logger.error(err);
        }
    }

    async handleAdditionalProcessInstanceInfos(processInstance: IProcessInstance) {
        if (!processInstance.rootProcessInstanceId) {
            const tenantRoom = processInstance.process.tenantId;
            this.uiGateway.emitTenant(tenantRoom, WsMessage.PROCESS, processInstance);
        }
        if (isProcessInstanceFinished(processInstance.status)) {
            await this.processFileService.deleteTempFiles(processInstance.orchestratorProcessInstanceId);
        }
        await this.updateProcessLastRunTime(processInstance);
    }

    async updateProcessLastRunTime(processInstance: IProcessInstance, entityManager?: EntityManager) {
        const processService = entityManager ? this.processService.withEntityManager(entityManager) : this.processService
        if (!processInstance?.process?.id) return;
        const process = await processService.findById(processInstance.process.id);

        if (process && processInstance.created) {
            await processService.partialUpdate({ id: process.id, lastRun: processInstance.created });
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
        installationId: string,
        entityManager: EntityManager,
    ) {
        const bot = await this.botService.withEntityManager(entityManager)
            .findByInstallationId(installationId)
            .catch(() => {
                this.logger.error(`Bot ${installationId} not found`);
                throw new NotFoundException(`Bot ${installationId} not found`);
            });
        const newProcessInstance = { ...processInstance };
        newProcessInstance.bot = bot;

        return await this.setPropertiesFromDatabase(newProcessInstance, entityManager);
    }

    private async setPropertiesFromDatabase(instanceToSave: IProcessInstance, entityManager: EntityManager) {
        const newProcessInstance = { ...instanceToSave };
        const dbProcessInstance =
            await this.processInstanceService.withEntityManager(entityManager).findOneById(instanceToSave.id);
        if (dbProcessInstance) {
            newProcessInstance.user = dbProcessInstance.user;
        }
        return { newProcessInstance, bot: newProcessInstance.bot };
    }

    private async updateProcessParams(
        processInstance: IProcessInstance,
        instanceToSave: IProcessInstance,
        bot: IBot,
        entityManager: EntityManager,
    ) {
        const newProcessInstance = {...instanceToSave};

        const newBot = {...bot};
        if (processInstance.status === ProcessInstanceStatus.IN_PROGRESS) {
            newBot.status = BotStatus.BUSY;
            newProcessInstance.input = processInstance.input;
        } else if (processInstance.status === ProcessInstanceStatus.INITIALIZING) {
            await this.updateProcessLastRunTime(processInstance, entityManager);
        } else if (isProcessInstanceFinished(processInstance.status)) {
            newProcessInstance.output = processInstance.output;
            if(!newProcessInstance.rootProcessInstanceId && bot.status !== BotStatus.DISCONNECTED) {
                newBot.status = BotStatus.CONNECTED;
            }
        }
        if (!newProcessInstance.rootProcessInstanceId) {
            const createdBot = await this.botService.withEntityManager(entityManager).save(newBot);
            const tenantRoom = createdBot.tenantId;
            this.uiGateway.emitTenant(tenantRoom, WsMessage.BOT_STATUS, newBot);
        }
        return newProcessInstance;
    }
}
