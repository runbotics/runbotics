import {Injectable} from '@nestjs/common';
import {Logger} from 'src/utils/logger';
import {InstantProcess} from 'src/types';
import {BotWsMessage, IBot} from 'runbotics-common';
import {v4 as uuidv4} from 'uuid';
import {WebsocketService} from 'src/websocket/websocket.service';

@Injectable()
export class ProcessSchedulerService {
    private readonly logger = new Logger(ProcessSchedulerService.name);

    constructor(private readonly websocketService: WebsocketService) {
    }

    async startProcess(instantProcess: InstantProcess, bot: IBot, scheduled: boolean) {
        const body = this.createStartProcessResponse(instantProcess, scheduled);

        await this.websocketService.sendMessageByBotId(bot.id, BotWsMessage.START_PROCESS, body);

        return {orchestratorProcessInstanceId: body.orchestratorProcessInstanceId};
    }

    private createStartProcessResponse(instantProcess: InstantProcess, scheduled: boolean) {
        return {
            orchestratorProcessInstanceId: uuidv4(),
            processId: instantProcess.process.id,
            input: instantProcess.input,
            userId: instantProcess.user.id,
            scheduled,
        };
    }
}
