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
import { IUser, ProcessQueueMessage } from 'runbotics-common';

@WebSocketGateway({ path: '/ws-ui', cors: { origin: '*' } })
export class UiGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private logger: Logger = new Logger(UiGateway.name);
    private uiSocketMap: Map<string, IUser> = new Map();
    @WebSocketServer() server: Server;

    constructor(
        private readonly authService: AuthService,
    ) { }

    async handleConnection(client: AuthSocket) {
        try {
            this.logger.log(`Client ${client.id} is trying to establish connection`);
            const user = await this.authService.validateWebsocketConnection(client);
            this.logger.log(`Client connected: ${user.login} | ${client.id}`);
            this.uiSocketMap.set(client.id, user);
        } catch (error) {
            this.logger.error(`Client ${client.id} failed to connect`, error);
        }
    }

    handleDisconnect(client: AuthSocket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.uiSocketMap.delete(client.id);
    }

    emitByUserId<T extends keyof ProcessQueueMessage>(userId: IUser['id'], event: T, data: ProcessQueueMessage[T]) {
        const clientId = this.getClientIdByUserId(userId);
        if (!clientId) {
            this.logger.error(`User with userId (${userId}) is not connected.`);
            return;
        }

        const clientSocket = this.server.sockets.sockets.get(clientId);
        if (!clientSocket) {
            this.logger.error(`Client with clientId (${clientId}) is not connected.`);
            return;
        }

        clientSocket.emit(event, data);
    }

    private getClientIdByUserId(userId: IUser['id']) {
        const sockets = this.uiSocketMap.entries();
        for (const [clientId, user] of sockets) {
            if (user.id === userId) return clientId;
        }
    }
}
