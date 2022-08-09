import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient<Socket>();

        const user = await this.authService.validateWebsocketConnection(client);

        context.switchToWs().getClient().user = user;

        return !!user;
    }
}
