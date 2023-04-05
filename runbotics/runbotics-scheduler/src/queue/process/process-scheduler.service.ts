import { Logger } from '#/utils/logger';
import { WebsocketService } from '#/websocket/websocket.service';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BotWsMessage, IBot, InstantProcess } from 'runbotics-common';

import { ProcessInputService } from './process-input.service';

@Injectable()
export class ProcessSchedulerService {
    private readonly logger = new Logger(ProcessSchedulerService.name);

    constructor(
        private readonly websocketService: WebsocketService,
        private readonly processInputService: ProcessInputService,
    ) {
    }

    async startProcess(instantProcess: InstantProcess, bot: IBot) {
        const orchestratorProcessInstanceId = randomUUID();

        const fileVariables = await this.processInputService.uploadAttendedFiles(instantProcess.process, instantProcess.input, orchestratorProcessInstanceId);

        const mergedInstantProcess = this.processInputService.mergeInputVariables(instantProcess, fileVariables);

        const body = this.createStartProcessResponse(mergedInstantProcess, orchestratorProcessInstanceId);

        await this.websocketService.sendMessageByBotId(bot.id, BotWsMessage.START_PROCESS, body);

        return { orchestratorProcessInstanceId };
    }

    private createStartProcessResponse(instantProcess: InstantProcess, orchestratorProcessInstanceId: string) {
        return {
            orchestratorProcessInstanceId,
            processId: instantProcess.process.id,
            input: instantProcess.input,
            trigger: instantProcess.trigger,
            ...(instantProcess.user && { userId: instantProcess.user.id }),
            ...(instantProcess.triggerData && { triggerData: instantProcess.triggerData }),
        };
    }
}
