import { ProcessInstanceEntity } from '../../database/process-instance/process-instance.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '../../utils/logger';
import { ProcessInstanceService } from '../../database/process-instance/process-instance.service';
import { BotService } from '../../database/bot/bot.service';
import { ProcessService } from '../../database/process/process.service';
import { BotStatus, IBot, IProcessInstance, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { Connection } from 'typeorm';
import { UiGateway } from '../gateway/ui.gateway';
import { getProcessInstanceUpdateFieldsByStatus, isProcessInstanceFinished } from './bot-process.service.utils';
import { MailService } from 'src/mail/mail.service';

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
    ) {}

    async updateProcessInstance(installationId: string, processInstance: IProcessInstance) {
        const instanceToSave = this.setPropertiesFromProcessInstance(processInstance);
        const { newProcessInstance, bot } = await this.setBotInProcessInstance(instanceToSave, installationId);

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const incrementedProcessInstance = await this.incrementExecutionCount(processInstance, newProcessInstance, bot);
            const dbProcessInstance = await queryRunner.manager.findOne(ProcessInstanceEntity, { id: incrementedProcessInstance.id });

            await queryRunner.manager.createQueryBuilder()
                .insert()
                .into(ProcessInstanceEntity)
                .values({ ...incrementedProcessInstance })
                .orUpdate(getProcessInstanceUpdateFieldsByStatus(incrementedProcessInstance.status, dbProcessInstance?.status), ['id'])
                .execute();

            await queryRunner.commitTransaction();

            const updatedProcessInstance = await this.processInstanceService.findById(processInstance.id);

            if (updatedProcessInstance.rootProcessInstanceId === null) {
                this.uiGateway.server.emit(WsMessage.PROCESS, updatedProcessInstance);
            }

            if (isProcessInstanceFinished(processInstance.status)) {
                await this.mailService.sendProcessResultMail(processInstance);
            }
        } catch (err) {
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
        instanceToSave.process = processInstance.process;
        instanceToSave.orchestratorProcessInstanceId = processInstance.orchestratorProcessInstanceId;
        instanceToSave.user = processInstance.user;
        instanceToSave.trigger = processInstance.trigger;
        instanceToSave.triggeredBy = processInstance.triggeredBy;
        return instanceToSave;
    }

    private async setBotInProcessInstance(
        processInstance: IProcessInstance,
        installationId: string
    ) {
        const bot = await this.botService.findByInstallationId(installationId);
        const newProcessInstance = { ...processInstance };
        if (!bot) {
            this.logger.error(`Bot ${installationId} not found`);
            throw new NotFoundException(`Bot ${installationId} not found`);
        }
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

    private async incrementExecutionCount(
        processInstance: IProcessInstance,
        instanceToSave: IProcessInstance,
        bot: IBot,
    ) {
        const newProcessInstance = {...instanceToSave};
        const newBot = {...bot};
        newBot.status = BotStatus.BUSY;
        if (ProcessInstanceStatus.IN_PROGRESS === processInstance.status) {
            newProcessInstance.input = processInstance.input;
            await this.incrementExecutionCountInStartedProcess(newProcessInstance);
        } else if (isProcessInstanceFinished(processInstance.status)) {
            newProcessInstance.output = processInstance.output;
            newProcessInstance.input = processInstance.input;
            if(!newProcessInstance.rootProcessInstanceId) {
                newBot.status = BotStatus.CONNECTED;
            }
            await this.incrementExecutionsByProcessStatus(processInstance);
        }
        if(!newProcessInstance.rootProcessInstanceId) {
            await this.botService.save(newBot);
            this.uiGateway.server.emit(WsMessage.BOT_STATUS, newBot);
        }
        return newProcessInstance;
    }

    private async incrementExecutionCountInStartedProcess(processInstance: IProcessInstance) {
        const process = await this.processService.findById(processInstance.process.id);
        if (process) {
            process.executionsCount++;
            await this.processService.save(process);
        }
    }

    private async incrementExecutionsByProcessStatus(processInstance: IProcessInstance) {
        const process = await this.processService.findById(processInstance.process.id);
        if (process) {
            if (processInstance.status === ProcessInstanceStatus.COMPLETED) {
                process.successExecutionsCount++;
            } else if (processInstance.status === ProcessInstanceStatus.ERRORED) {
                process.failureExecutionsCount++;
            }
        }
        await this.processService.save(process);
    }
}
