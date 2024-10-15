/* eslint-disable @typescript-eslint/no-explicit-any */
import { BotWebSocketGateway } from './bot/bot.gateway';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { BotWsMessage } from 'runbotics-common';
import { hasErrorMessage } from '#/utils/ws-acknowledgement';
import { Logger } from '#/utils/logger';

@Injectable()
export class WebsocketService {
    private readonly logger: Logger = new Logger(WebsocketService.name);

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

        try {
            await this.send(bot.installationId, message, body);
        } catch (error: any) {
            this.logger.error(error);
            throw error;
        }
    }

    private async send(installationId: string, message: BotWsMessage, body?: any) {
        const server = this.botWebSocketGateway.server;
        const response = await server
            .to(installationId)
            .timeout(10000)
            .emitWithAck(message, body);

        if (hasErrorMessage(response[0])) {
            throw new Error(response[0].errorMessage);
        }
    }
}
