import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from '#/auth/auth.service';
import { AuthSocket } from '#/types';
import { Logger } from '#/utils/logger';
import { WsQueueMessage } from 'runbotics-common';

@WebSocketGateway({ path: '/ws-ui', cors: { origin: '*' } })
export class UiGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private logger: Logger = new Logger(UiGateway.name);
    @WebSocketServer() server: Server;

    constructor(
        private readonly authService: AuthService,
    ) {}

    async handleConnection(client: AuthSocket) {
        try {
            this.logger.log(`Client ${client.id} is trying to establish connection`);
            const user = await this.authService.validateWebsocketConnection(client);
            this.logger.log(`Client connected: ${user.email} | ${client.id}`);
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

    emitClient<T extends keyof WsQueueMessage>(clientId: string | undefined, event: T, data: WsQueueMessage[T]) {
        if (!clientId) return;

        const clientSocket = this.server.sockets.sockets.get(clientId);
        if (!clientSocket) {
            this.logger.error(`Client with ID: ${clientId} not found.`);
            return;
        }

        clientSocket.emit(event, data);
    }
}
