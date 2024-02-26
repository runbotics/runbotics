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
import { FeatureKey, ProcessInput, ProcessQueueMessage, WsMessage } from 'runbotics-common';
import { ProcessWebsocketService } from '#/queue/process/process-websocket.service';
import { FeatureKeys } from '#/auth/featureKey.decorator';
import { UseGuards } from '@nestjs/common';
import { WsFeatureKeyGuard } from '#/auth/guards/ws-featureKey.guard';

@WebSocketGateway({ path: '/ws-ui', cors: { origin: '*' } })
export class UiGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private logger: Logger = new Logger(UiGateway.name);
    @WebSocketServer() server: Server;

    constructor(
        private readonly authService: AuthService,
        private readonly processWebsocketService: ProcessWebsocketService,
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

    emitToClient(clientId: string, event: string, data: any) {
        const clientSocket = this.server.sockets.sockets.get(clientId);
        if (clientSocket) {
            clientSocket.emit(event, data);
        } else {
            this.logger.error(`Client with ID: ${clientId} not found.`);
        }
    }

    @SubscribeMessage(WsMessage.START_PROCESS)
    @UseGuards(WsFeatureKeyGuard)
    @FeatureKeys(FeatureKey.PROCESS_START)
    async handleStartProcess(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody('processId') processId: number,
        @MessageBody('input') input: ProcessInput
    ) {
        this.logger.log(`Starting process: ${processId}`);
        try {
            const { jobId, jobIndex } = await this.processWebsocketService.startProcess(client, processId, input);
            this.logger.log(`Emitting process start jobId: ${jobId}`);
            const payload: ProcessQueueMessage[WsMessage.PROCESS_WAITING] = {
              jobId,
              jobIndex,
            }
            this.emitToClient(client.id, WsMessage.PROCESS_WAITING, payload)
        } catch (err: any) {
            this.logger.log(`Emitting process start error`);
            const payload: ProcessQueueMessage[WsMessage.PROCESS_FAILED] = {
              message: err?.message ?? 'Internal server error',
            }
            this.emitToClient(client.id, WsMessage.PROCESS_FAILED, payload);
        }
    }
}
