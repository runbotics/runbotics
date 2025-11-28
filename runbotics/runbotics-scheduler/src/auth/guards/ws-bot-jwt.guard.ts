import { BotAuthSocket } from '#/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TaskQueue } from '#/utils/task-queue';

@Injectable()
export class WsBotJwtGuard implements CanActivate {
    private static taskQueue = new TaskQueue(4);

    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext) {
        const client = context.switchToWs().getClient<BotAuthSocket>();

        return WsBotJwtGuard.taskQueue.enqueue(async () => {
            const validationResponse = await this.authService.validateBotWebsocketConnection({client, isGuard: true});
            if (validationResponse === null || validationResponse === undefined) {
                return false;
            }
            const { bot, user } = validationResponse;
            context.switchToWs().getClient().bot = bot;
            context.switchToWs().getClient().user = user;
            return !!user;
        });
    }
}
