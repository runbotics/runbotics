import { Injectable } from '@nestjs/common';
import { UiGateway } from '#/websocket/ui/ui.gateway';
import { ProcessQueueMessage, WsMessage } from 'runbotics-common';
import Axios  from 'axios';
import { JobId } from 'bull';

@Injectable()
export class MessagingService {
    constructor(
        private readonly uiGateway: UiGateway,
    ) {}

    public async emitProcessQueueUpdate(jobId: JobId) {
        const payload: ProcessQueueMessage[WsMessage.PROCESS_QUEUE_UPDATE] = { jobId };
        this.uiGateway.server.emit(WsMessage.PROCESS_QUEUE_UPDATE, payload);
    }

    public async sendSpecificJobMessage<T extends keyof ProcessQueueMessage>(event: T, data: ProcessQueueMessage[T], clientId?: string, callbackUrl?: string) {
        if (clientId) {
            this.uiGateway.emitToClient(clientId, event, data);
        }
        if (callbackUrl) {
            await Axios.post(callbackUrl, { event, data });
        }
    }
}