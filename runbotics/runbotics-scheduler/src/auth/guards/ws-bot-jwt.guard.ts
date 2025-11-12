import { BotAuthSocket } from '#/types/auth-socket';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WsBotJwtGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient<BotAuthSocket>();
        
        if (!client.bot || !client.user) {
            return false;
        }

        const { token } = client.handshake.auth;
        if (!token) {
            return false;
        }

        return true;
    }
}
