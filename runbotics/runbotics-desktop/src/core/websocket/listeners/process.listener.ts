import { Injectable } from '@nestjs/common';
import {
    InjectIoClientProvider,
    IoClient,
    OnConnect,
    OnConnectError,
    OnDisconnect,
    EventListener,
} from 'nestjs-io-client';
import { BotWsMessage, IProcess } from 'runbotics-common';

import { schedulerAxios, StorageService } from '#config';
import { RuntimeService } from '#core/bpm/runtime';
import { RunboticsLogger } from '#logger';
import { delay, SECOND } from '#utils';

import { AuthService } from '../auth/auth.service';
import { StartProcessMessageBody, KeepAliveStatus } from './process.listener.types';
import { initKeepAliveStatus } from './process.listener.utils';
import { MessageQueueService, Message } from '../queue/message-queue.service';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class ProcessListener {
    private readonly logger = new RunboticsLogger(ProcessListener.name);
    private keepAliveStatus: KeepAliveStatus = initKeepAliveStatus;

    constructor(
        @InjectIoClientProvider() private readonly io: IoClient,
        private readonly runtimeService: RuntimeService,
        private readonly authService: AuthService,
        private readonly queueService: MessageQueueService,
        private readonly websocketService: WebsocketService,
        private readonly storageService: StorageService,
    ) {}

    private beginKeepAliveInterval() {
        const intervalId = setInterval(() => {
            const message: Message = {
                event: BotWsMessage.KEEP_ALIVE,
                payload: null
            };

            this.websocketService.emitMessageWithoutQueue(message);
        }, 60000);

        this.keepAliveStatus = { intervalId, isActive: true };
    }

    private clearKeepAliveInterval() {
        clearInterval(this.keepAliveStatus.intervalId);
        this.keepAliveStatus = initKeepAliveStatus;
    }

    @OnConnect()
    connect() {
        this.logger.log(`Connected to Scheduler (id: ${this.io.id})`);
        this.queueService
            .getAll()
            .forEach((element) => this.websocketService.emitMessage(element, true));

        this.beginKeepAliveInterval();
    }

    @OnConnectError()
    async connectError(error: Error) {
        this.logger.error('Scheduler is unreachable', error);
        await delay(5 * SECOND);
        this.io.connect();
    }

    @OnDisconnect()
    async disconnect(reason: IoClient.DisconnectReason) {
        this.clearKeepAliveInterval();
        this.logger.error('Scheduler connection has been closed: ', reason);
        await delay(5 * SECOND);
        this.io.auth = await this.authService.getCredentials();
        this.io.connect();
    }

    @EventListener(BotWsMessage.START_PROCESS)
    async startProcess(data: StartProcessMessageBody, ackCallback: (payload?: any) => void) {
        try {
            this.logger.log(`=> Incoming message to start process (id: ${data.processId})`);

            const { processInstancesCount } = this.runtimeService.getRuntimeStatus();

            if (processInstancesCount > 0) {
                throw new Error('Process is already running');
            }

            const { processId, input, ...rest } = data;
            const tenantId = this.storageService.getValue('tenantId');
            const process = await schedulerAxios
                .get<IProcess>(
                    `/api/scheduler/tenants/${tenantId}/processes/${processId}`
                )
                .then((response) => {
                    return response.data;
                });

            if (!process) {
                throw new Error(`Process not found in tenant bot is authenticated to. Process id: ${processId}, bot tenant id: ${tenantId}`);
            }

            this.logger.log('Starting process: ' + process.name);

            const variables = input?.variables ?? {};
            const callbackUrl = input?.callbackUrl;

            await this.runtimeService.startProcessInstance({
                process,
                variables,
                ...rest,
                ...(callbackUrl && { callbackUrl }),
            });

            this.logger.log(`<= Process successfully started (id: ${processId})`);

            ackCallback();

        } catch (error) {
            this.logger.error(`<= Failed to start process (id: ${data.processId})`, error);

            ackCallback({ errorMessage: error.message });
        }
    }

    @EventListener(BotWsMessage.TERMINATE)
    async terminateProcessInstance(processInstanceId: string, ackCallback: (payload?: any) => void) {
        try {
            this.logger.log(`=> Incoming message to terminate process instance (id: ${processInstanceId})`);
            await this.runtimeService.terminateProcessInstance(processInstanceId);
            this.logger.log(`<= Process instance successfully terminated (id: ${processInstanceId})`);
            ackCallback();
        } catch (error) {
            this.logger.error(`<= Process instance failed to terminated (id: ${processInstanceId})`);
            ackCallback({ errorMessage: `Process instance ${processInstanceId} is not running` });
        }
    }
}
