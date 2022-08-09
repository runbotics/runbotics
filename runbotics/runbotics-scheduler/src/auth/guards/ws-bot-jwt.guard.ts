import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@Injectable()
export class WsBotJwtGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient<Socket>();

        const { bot, user } = await this.authService.validateBotWebsocketConnection({client, isGuard: true});

        context.switchToWs().getClient().user = user;
        context.switchToWs().getClient().bot = bot;

        return !!user;
    }
}
