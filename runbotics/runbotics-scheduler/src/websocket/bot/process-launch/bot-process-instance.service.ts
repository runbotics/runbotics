import { Injectable, NotFoundException } from '@nestjs/common';
import { BotStatus, IBot, IProcessInstance, isEmailTriggerData, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { Connection } from 'typeorm';

import { Logger } from '#/utils/logger';
import { ProcessInstanceEntity } from '#/database/process-instance/process-instance.entity';
import { ProcessInstanceService } from '#/database/process-instance/process-instance.service';
import { BotService } from '#/database/bot/bot.service';
import { ProcessService } from '#/database/process/process.service';
import { MailService } from '#/mail/mail.service';
import { ProcessFileService } from '#/queue/process/process-file.service';
import { NotificationService } from '#/microsoft/notification';

import { UiGateway } from '../../ui/ui.gateway';
import { getProcessInstanceUpdateFieldsByStatus, isProcessInstanceFinished } from './bot-process-instance.service.utils';

@Injectable()
export class BotProcessService {
    private readonly logger = new Logger(BotProcessService.name);

    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly botService: BotService,
        private readonly processService: ProcessService,
        private readonly connection: Connection,
        private readonly uiGateway: UiGateway,
        private readonly mailService: MailService,
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
            const updatedLastInstanceRunTime = await this.updateLastRunTime(processInstance, newProcessInstance, bot);
            const dbProcessInstance = await queryRunner.manager.findOne(ProcessInstanceEntity, { where: { id: updatedLastInstanceRunTime.id } });

            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into(ProcessInstanceEntity)
                .values({ ...updatedLastInstanceRunTime })
                .orUpdate(getProcessInstanceUpdateFieldsByStatus(updatedLastInstanceRunTime.status, dbProcessInstance?.status), ['id'])
                .execute();

            await queryRunner.commitTransaction();

            const updatedProcessInstance = await this.processInstanceService.findById(processInstance.id);

            if (!processInstance.rootProcessInstanceId) {
                this.uiGateway.server.emit(WsMessage.PROCESS, updatedProcessInstance);
            }

            if (!processInstance.rootProcessInstanceId && isProcessInstanceFinished(processInstance.status)) {
                if (isEmailTriggerData(processInstance.triggerData) && processInstance.triggerData.emailId)
                    await this.notificationService.sendProcessResultMail(processInstance);
                else
                    await this.mailService.sendProcessResultMail(processInstance);
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

    private setPropertiesFromProcessInstance(processInstance: IProcessInstance) {
        const instanceToSave = new ProcessInstanceEntity();
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
        instanceToSave.process = processInstance.process;
        instanceToSave.orchestratorProcessInstanceId = processInstance.orchestratorProcessInstanceId;
        instanceToSave.user = processInstance.user;
        instanceToSave.trigger = processInstance.trigger;
        instanceToSave.triggerData = processInstance.triggerData;
        return instanceToSave;
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
        const dbProcessInstance = await this.processInstanceService.findById(instanceToSave.id);
        if (dbProcessInstance) {
            newProcessInstance.created = dbProcessInstance.created;
            newProcessInstance.user = dbProcessInstance.user;
        }
        return { newProcessInstance, bot: newProcessInstance.bot };
    }

    private async updateLastRunTime(
        processInstance: IProcessInstance,
        instanceToSave: IProcessInstance,
        bot: IBot,
    ) {
        const newProcessInstance = {...instanceToSave};

        const newBot = {...bot};
        if (processInstance.status === ProcessInstanceStatus.IN_PROGRESS) {
            newBot.status = BotStatus.BUSY;
            newProcessInstance.input = processInstance.input;
            await this.updateProcessLastRunTime(newProcessInstance);
        } else if (isProcessInstanceFinished(processInstance.status)) {
            newProcessInstance.output = processInstance.output;
            newProcessInstance.input = processInstance.input;
            if(!newProcessInstance.rootProcessInstanceId && bot.status !== BotStatus.DISCONNECTED) {
                newBot.status = BotStatus.CONNECTED;
            }
            await this.updateProcessLastRunTime(processInstance);
        }
        if (!newProcessInstance.rootProcessInstanceId) {
            await this.botService.save(newBot);
            this.uiGateway.server.emit(WsMessage.BOT_STATUS, newBot);
        }
        return newProcessInstance;
    }

    private async updateProcessLastRunTime(processInstance: IProcessInstance) {
        if (!processInstance?.process?.id) return;
        const process = await this.processService.findById(processInstance.process.id);

        if (process) {
            process.lastRun = processInstance.created;
            await this.processService.save(process);
        }
    }
}
