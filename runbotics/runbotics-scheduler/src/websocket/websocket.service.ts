import { BotWebSocketGateway } from './gateway/bot.gateway';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BotService } from '#/database/bot/bot.service';
import { BotWsMessage } from 'runbotics-common';

@Injectable()
export class WebsocketService {
    private readonly logger = new Logger(WebsocketService.name);

    constructor(
        private readonly botService: BotService,
        private readonly botWebSocketGateway: BotWebSocketGateway,
    ) {}

    async sendMessageByBotId(
        botId: number, message: BotWsMessage, body?: any
    ) {
        const bot = await this.botService.findById(botId);
        if (!bot) {
            this.logger.error(`Bot ${botId} does not exist`);
            throw new NotFoundException(`Bot ${botId} does not exist`);
        }

        this.send(bot.installationId, message, body);
    }

    async sendMessageByInstallationId(
        installationId: string, message: BotWsMessage, body?: any
    ) {
        const bot = await this.botService.findByInstallationId(installationId);
        if (!bot) {
            this.logger.error(`Bot ${installationId} does not exist`);
            throw new NotFoundException(`Bot ${installationId} does not exist`);
        }

        this.send(bot.installationId, message, body);
    }

    private send(installationId: string, message: BotWsMessage, body?: any) {
        if (body) {
            this.botWebSocketGateway.server.to(installationId).emit(message, body);
        } else {
            this.botWebSocketGateway.server.to(installationId).emit(message);
        }
    }
}