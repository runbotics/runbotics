import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { AuthSocket } from 'src/types';
import { Logger } from 'src/utils/logger';

@WebSocketGateway({ path: '/ws-ui', cors: { origin: '*' } })
export class UiGateway implements OnGatewayDisconnect, OnGatewayConnection {
    private logger: Logger = new Logger(UiGateway.name);
    @WebSocketServer() server: Server;

    constructor(
        private readonly authService: AuthService,
    ) { }

    async handleConnection(client: AuthSocket) {
        this.logger.log(`Client ${client.id} is trying to establish connection`);

        const user = await this.authService.validateWebsocketConnection(client);

        this.logger.log(`Client connected: ${user.login} | ${client.id}`);
    }

    handleDisconnect(client: AuthSocket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}