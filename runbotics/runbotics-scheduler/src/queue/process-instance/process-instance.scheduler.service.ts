import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '#/utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { ProcessInstanceService } from '#/database/process-instance/process-instance.service';
import { BotWsMessage, IProcessInstance, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { WebsocketService } from '#/websocket/websocket.service';
import { Job } from '#/utils/process';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import dayjs from 'dayjs';

@Injectable()
export class ProcessInstanceSchedulerService {
    private readonly logger = new Logger(ProcessInstanceSchedulerService.name);
    constructor(
        private readonly processInstanceService: ProcessInstanceService,
        private readonly websocketService: WebsocketService,
        private readonly uiGateway: UiGateway,
    ) { }

    async saveFailedProcessInstance(job: Job, errorMessage: string) {
        const status: ProcessInstanceStatus = ProcessInstanceStatus.ERRORED;
        const processInstance: IProcessInstance = {
            id: uuidv4(),
            status,
            created: dayjs().toISOString(),
            updated: dayjs().toISOString(),
            input: JSON.stringify({ variables: job.data.input?.variables }),
            user: job.data.user,
            process: job.data.process,
            error: errorMessage,
            trigger: job.data.trigger,
            ...(job.data?.triggerData && { triggerData: job.data.triggerData }),
        };
        await this.processInstanceService.save(processInstance);
        this.uiGateway.server.emit(WsMessage.PROCESS, processInstance);
    }

    async terminateProcessInstance(processInstanceId: string) {
        const processInstance = await this.processInstanceService.findById(processInstanceId);
        
        if (!processInstance) {
            this.logger.error(`Process instance ${processInstanceId} does not exist`);
            throw new NotFoundException(`Process instance (${processInstanceId}) does not exist`);
        }
        
        await this.websocketService.sendMessageByBotId(
            processInstance.bot.id,
            BotWsMessage.TERMINATE,
            processInstanceId
        );
    }
}
