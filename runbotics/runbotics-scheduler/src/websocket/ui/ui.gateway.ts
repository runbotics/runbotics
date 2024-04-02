import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from '#/auth/auth.service';
import { AuthSocket } from '#/types';
import { Logger } from '#/utils/logger';
import { FeatureKey, JobData, ProcessInput, WsQueueMessage, TriggerEvent, WsMessage } from 'runbotics-common';
import { forwardRef, Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { WsFeatureKeyGuard } from '#/auth/guards/ws-featureKey.guard';
import { Job, JobId } from 'bull';
import { ProcessGuestService } from '#/queue/process/process-guest.service';
import { GuestService } from '#/database/guest/guest.service';
import { QueueService } from '#/queue/queue.service';
import { checkMessageProperty } from '#/utils/error-message.utils';

@WebSocketGateway({ path: '/ws-ui', cors: { origin: '*' } })
export class UiGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private logger: Logger = new Logger(UiGateway.name);
    @WebSocketServer() server: Server;

    constructor(
        private readonly authService: AuthService,
        private readonly guestService: GuestService,
        private readonly processGuestService: ProcessGuestService,
        @Inject(forwardRef(() => QueueService))
            private queueService: QueueService,
    ) { }

    async handleConnection(client: AuthSocket) {
        try {
            this.logger.log(`Client ${client.id} is trying to establish connection`);
            const user = await this.authService.validateWebsocketConnection(client);
            this.logger.log(`Client connected: ${user.login} | ${client.id}`);
        } catch (error) {
            this.logger.error(`Client ${client.id} failed to connect`, error);
        }
    }

    handleDisconnect(client: AuthSocket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    emitAll<T extends keyof WsQueueMessage>(event: T, data: WsQueueMessage[T]) {
        this.server.emit(event, data);
    }

    emitClient<T extends keyof WsQueueMessage>(clientId: string, event: T, data: WsQueueMessage[T]) {
        const clientSocket = this.server.sockets.sockets.get(clientId);
        if (!clientSocket) {
            this.logger.error(`Client with ID: ${clientId} not found.`);
            return;
        }

        clientSocket.emit(event, data);
    }

    @SubscribeMessage(WsMessage.PROCESS_START)
    @UseGuards(WsFeatureKeyGuard)
    @FeatureKeys(FeatureKey.PROCESS_START)
    async handleStartProcess(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody('processId') processId: number,
        @MessageBody() input: ProcessInput,
    ) {
        const user = await this.authService.validateWebsocketConnection(client);
        const userId = user.id;
        const isUserGuest = this.processGuestService.getIsGuest(user.authorities);
        const initialExecutionsCount = isUserGuest ? await this.processGuestService.getExecutionsCount(userId) : 0;
        try {
            this.logger.log(`Checking if user (${userId}) is a guest and can start process ${processId}`);
            await this.processGuestService.checkCanStartProcess(user);

            this.logger.log(`=> Starting process ${processId}`);
            const process = await this.queueService.getProcessById(processId);
            await this.queueService.validateProcessAccess({ process, user });

            await this.queueService.createInstantJob({
                process,
                input,
                user,
                clientId: client.id,
                trigger: { name: TriggerEvent.MANUAL },
                triggerData: { userEmail: user.email }
            });

            this.logger.log(`<= Process ${processId} successfully started`);

            if (isUserGuest) {
                await this.guestService.incrementExecutionsCount(userId);
                this.logger.log(`Incremented user's (${userId}) executions-count to ${initialExecutionsCount + 1}`);
            }
        } catch (err) {
            this.logger.error(`<= Process ${processId} failed to start`);

            if(isUserGuest) {
                await this.guestService.setExecutionsCount(userId, initialExecutionsCount);
                this.logger.log(`Restored user's executions-count to ${initialExecutionsCount}`);
            }

            const errorMessage = checkMessageProperty(err) || 'Internal server error';
            this.emitAll( WsMessage.PROCESS_START_FAILED, { processId, errorMessage });
        }
    }

    @SubscribeMessage(WsMessage.JOB_REMOVE)
    @UseGuards(WsFeatureKeyGuard)
    @FeatureKeys(FeatureKey.PROCESS_START)
    async handleTerminateProcess(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody('processId') processId: number,
        @MessageBody('jobId') jobId: JobId,
    ) {
        const user = await this.authService.validateWebsocketConnection(client);
        const userId = user.id;
        const isUserGuest = this.processGuestService.getIsGuest(user.authorities);
        const initialExecutionsCount = isUserGuest ? await this.processGuestService.getExecutionsCount(userId) : null;
        try {
            this.logger.log(`Checking if user (${userId}) is a guest and can terminate job ${jobId}`);
            await this.processGuestService.checkCanStartProcess(user);
            const job: Job<JobData> = await this.queueService.getJobById(jobId);
            if (!job || !job?.data) {
                throw new NotFoundException(`Job with jobId (${jobId}) was not found.`);
            }

            await this.queueService.validateProcessAccess({ process: job.data.process, user });

            this.logger.log(`=> Terminating job ${jobId}`);
            await this.queueService.deleteJobFromQueue(jobId);

            this.logger.log(`<= Job ${jobId} successfully removed`);

            if(isUserGuest) {
                await this.guestService.decrementExecutionsCount(userId);
                this.logger.log(`Decremented user's (${userId}) executions-count to ${initialExecutionsCount - 1}`);
            }
        } catch (err) {
            this.logger.error(`<= Job ${jobId} failed to be removed`, err);

            if  (isUserGuest) {
                await this.guestService.setExecutionsCount(userId, initialExecutionsCount);
                this.logger.log(`Restored user's executions-count to ${initialExecutionsCount}`);
            }

            const errorMessage = checkMessageProperty(err) || 'Internal server error';
            this.emitAll(WsMessage.JOB_REMOVE_FAILED, { processId, errorMessage });
        }
    }
}
