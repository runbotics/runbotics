/* eslint-disable @typescript-eslint/no-explicit-any */
import { BotWebSocketGateway } from './bot/bot.gateway';
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

        const connectedBots = this.botWebSocketGateway.connectedBots;
        if (!connectedBots.length) {
            this.logger.error('There are no connected bots');
            throw new NotFoundException('There are no connected bots');
        }

        const connectedBot = connectedBots.find((connectedBot) => connectedBot.botId === botId);
        if (!connectedBot) {
            this.logger.error(`There is no connection with bot ${botId}`);
            throw new NotFoundException(`There is no connection with bot ${botId}`);
        }

        try {
            await this.send(connectedBot.socketId, message, body);
        } catch (error) {
            if (typeof error === 'string') {
                throw new Error(error);
            }
        }
    }

    private send(socketId: string, message: BotWsMessage, body?: any) {
        const socket = this.botWebSocketGateway.server.sockets.sockets.get(socketId);

        return new Promise((resolve, reject) => {
            if (body) {
                socket.emit(message, body, (response) => {
                    response
                        ? reject(response.errorMessage)
                        : resolve(message);
                });
            } else {
                socket.emit(message, (response) => {
                    response
                        ? reject(response.errorMessage)
                        : resolve(message);
                });
            }
        });
    }
}