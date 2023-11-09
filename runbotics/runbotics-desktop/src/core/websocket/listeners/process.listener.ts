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

import { orchestratorAxios } from '#config';
import { RuntimeService } from '#core/bpm/runtime';
import { RunboticsLogger } from '#logger';
import { delay, SECOND } from '#utils';

import { AuthService } from '../auth/auth.service';
import { StartProcessMessageBody } from './process.listener.types';
import { MessageQueueService } from '../queue/message-queue.service';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class ProcessListener {
    private readonly logger = new RunboticsLogger(ProcessListener.name);

    constructor(
        @InjectIoClientProvider() private readonly io: IoClient,
        private readonly runtimeService: RuntimeService,
        private readonly authService: AuthService,
        private readonly queueService: MessageQueueService,
        private readonly websocketService: WebsocketService
    ) {}

    @OnConnect()
    connect() {
        this.logger.log(`Connected to Scheduler (id: ${this.io.id})`);
        this.queueService
            .getAll()
            .forEach((element) => this.websocketService.emitMessage(element, true));
    }

    @OnConnectError()
    async connectError(error: Error) {
        this.logger.error('Scheduler is unreachable', error);
        await delay(5 * SECOND);
        this.io.connect();
    }

    @OnDisconnect()
    async disconnect(reason: IoClient.DisconnectReason) {
        this.logger.error('Scheduler connection has been closed: ', reason);
        await delay(5 * SECOND);
        this.io.auth = await this.authService.getCredentials();
        this.io.connect();
    }

    @EventListener(BotWsMessage.START_PROCESS)
    async startProcess(data: StartProcessMessageBody, ackCallback: (payload?: any) => void) {
        this.logger.log(`=> Incoming message to start process (id: ${data.processId})`);

        const { processInstancesCount } = this.runtimeService.getRuntimeStatus();

        if (processInstancesCount > 0) {
            const errorMessage = 'Process is already running';

            this.logger.error(`<= ${errorMessage}}`);

            ackCallback({ errorMessage });

            throw new Error(errorMessage);
        }

        ackCallback();

        const { processId, input, ...rest } = data;
        const process = await orchestratorAxios
            .get<IProcess>(`/api/processes/${processId}`, { maxRedirects: 0 })
            .then((response) => {
                this.logger.log('Starting process: ' + response.data.name);
                return response.data;
            })
            .catch((error) => {
                this.logger.error(
                    `<= Error fetching process details (id: ${processId})`,
                    error
                );
                throw error;
            });

        await this.runtimeService.startProcessInstance({
            process,
            variables: input?.variables ?? {},
            ...rest,
        });

        this.logger.log(`<= Process successfully started (id: ${processId})`);
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
