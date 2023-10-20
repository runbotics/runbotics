import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';

@Injectable()
export class WsBotJwtGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient<Socket>();

        const validationResponse = await this.authService.validateBotWebsocketConnection({client, isGuard: true});
        if (validationResponse === null || validationResponse === undefined) {
            return false;
        }
        const { bot, user } = validationResponse;
        context.switchToWs().getClient().bot = bot;
        context.switchToWs().getClient().user = user;
        return !!user;
    }
}
