import { Injectable } from '@nestjs/common';
import { Logger } from '#/utils/logger';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { BotStatus, WsMessage } from 'runbotics-common';
import { User } from '#/scheduler-database/user/user.entity';
import { UiGateway } from '#/websocket/ui/ui.gateway';


@Injectable()
export class BotSchedulerService {

    private readonly logger = new Logger(BotSchedulerService.name);

    constructor(
        private readonly botService: BotService,
        private readonly uiGateway: UiGateway,
    ) {}

    async getBotStatusForUser(user: User) {
        this.logger.log(`Getting bot status for user ${user.email}`);
        const bot = await this.botService.findByInstallationId(user.email);

        if (bot && bot.status === BotStatus.CONNECTED) {
            this.logger.warn(`Bot ${bot.installationId} is connected`);
            return { connected: true };
        }

        this.logger.warn(`Bot of user ${user.email} is disconnected or not found`);
        return { connected: false };
    }

    async initializeBotsStatuses() {
        this.logger.log('Initializing bots statuses');
        const bots = await this.botService.findAll();
        const mappedBots = bots.map((bot) => ({
            ...bot,
            status: BotStatus.DISCONNECTED,
        }));

        const updatedBots = this.botService.saveAll(mappedBots);
        this.logger.log('Bots statuses successfully initialized');
        return updatedBots;
    }

    async deleteById(id) {
        return this.botService.delete(id).then(() => {
            this.uiGateway.server.emit(WsMessage.BOT_DELETE, id);
            this.logger.log(`<== Bot ${id} deleted successfully`);
        });
    }
}
