/* eslint-disable @typescript-eslint/no-explicit-any */
import { BotWebSocketGateway } from './bot/bot.gateway';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BotService } from '#/database/bot/bot.service';
import { BotWsMessage } from 'runbotics-common';
import { hasErrorMessage } from '#/utils/ws-acknowledgement';

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

        const connectedBotsCount = this.botWebSocketGateway.connectedBotsCount;
        if (!connectedBotsCount) {
            this.logger.error('There are no connected bots');
            throw new NotFoundException('There are no connected bots');
        }

        const socketId = this.botWebSocketGateway.getConnectedBotSocketId(botId);
        if (!socketId) {
            this.logger.error(`There is no connection with bot ${botId}`);
            throw new NotFoundException(`There is no connection with bot ${botId}`);
        }

        try {
            await this.send(socketId, message, body);
        } catch (error: any) {
            throw new Error(error);
        }
    }

    private send(socketId: string, message: BotWsMessage, body?: any) {
        const socket = this.botWebSocketGateway.server.sockets.sockets.get(socketId);

        return new Promise((resolve, reject) => {
            const handlePromise = (response) => {
                hasErrorMessage(response)
                    ? reject(response.errorMessage)
                    : resolve(message);
            };

            socket.emit(message, body, (response) => {
                handlePromise(response);
            });
        });
    }
}