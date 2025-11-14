import { BotAuthSocket } from '#/types/auth-socket';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TaskQueue } from '#/utils/task-queue';

@Injectable()
export class WsBotJwtGuard implements CanActivate {
    private static taskQueue = new TaskQueue(4);

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

        return WsBotJwtGuard.taskQueue.enqueue(async () => {
            const user = await this.authService.validateToken(token);
            
            if (!user || !user.tenant?.active) {
                return false;
            }

            return true;
        });
    }
}
