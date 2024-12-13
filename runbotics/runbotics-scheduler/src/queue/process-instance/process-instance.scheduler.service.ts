import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '#/utils/logger';
import { BotWsMessage, ProcessInstanceStatus, WsMessage } from 'runbotics-common';
import { WebsocketService } from '#/websocket/websocket.service';
import { Job } from '#/utils/process';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import dayjs from 'dayjs';
import { ProcessInstanceService } from '#/scheduler-database/process-instance/process-instance.service';
import { CreateProcessInstanceDto } from '#/scheduler-database/process-instance/dto/create-process-instance.dto';
import { User } from '#/scheduler-database/user/user.entity';

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
        const processInstance: CreateProcessInstanceDto = {
            status,
            created: dayjs().toISOString(),
            updated: dayjs().toISOString(),
            input: JSON.stringify({ variables: job.data.input?.variables }),
            userId: job.data.user.id,
            processId: job.data.process.id,
            error: errorMessage,
            trigger: job.data.trigger,
            ...(job.data?.triggerData && { triggerData: job.data.triggerData }),
        };
        const createdProcessInstance =
            await this.processInstanceService.create(processInstance);
        this.uiGateway.server.emit(WsMessage.PROCESS, createdProcessInstance);
    }

    async terminateProcessInstance(processInstanceId: string, user: User) {
        const processInstance =
            await this.processInstanceService.getOne(processInstanceId, user);

        if (!processInstance) {
            this.logger.error(`Process instance ${processInstanceId} not found`);
            throw new NotFoundException(`Process instance (${processInstanceId}) not found`);
        }

        await this.websocketService.sendMessageByBotId(
            processInstance.bot.id,
            BotWsMessage.TERMINATE,
            processInstanceId
        );
    }
}
