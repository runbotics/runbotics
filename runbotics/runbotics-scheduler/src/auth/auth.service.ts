import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ServerConfigService } from '../config/server-config/server-config.service';
import { BotEntity } from '../database/bot/bot.entity';
import { BotService } from '../database/bot/bot.service';
import { UserService } from '../database/user/user.service';
import { JWTPayload } from '../types';
import { Logger } from '../utils/logger';
import { BotStatus, IBot } from 'runbotics-common';
import { BotSystemService } from '../database/bot-system/bot-system.service';
import { BotCollectionService } from '../database/bot-collection/bot-collection.service';
import { MutableBotParams, RegisterNewBotParams } from './auth.service.types';
import dayjs from 'dayjs';

interface ValidatorBotWsProps {
    client: Socket;
    isGuard?: boolean;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly botService: BotService,
        private readonly botSystemService: BotSystemService,
        private readonly botCollectionService: BotCollectionService,
        private readonly serverConfigService: ServerConfigService,
    ) {}

    validatePayload(payload: JWTPayload) {
        return this.userService.findByLogin(payload.sub);
    }

    validateToken(token: string) {
        const secret = this.serverConfigService.secret;
        const jwtPayload = jwt.verify(token, secret) as JWTPayload;
        return this.validatePayload(jwtPayload);
    }

    async validateWebsocketConnection(client: Socket) {
        const { token } = client.handshake.auth;

        if (!token) {
            client.disconnect();
            throw new WsException('empty token');
        }

        const user = await this.validateToken(token)
            .catch((error) => {
                client.disconnect();
                this.logger.error('token validation error', error);
                throw new WsException('token user validation exception');
            });

        if (!user) {
            client.disconnect();
            throw new WsException('user does not exist');
        }

        return user;
    }

    private extractSemanticVersion(version: string): Promise<[number, number, number]> {
        return new Promise((resolve, reject) => {
            const [
                major,
                minor,
                patch,
            ] = version.split('.').map(v => parseInt(v, 10));

            if (Number.isNaN(major) || Number.isNaN(minor) || Number.isNaN(patch)) {
                reject('Provided version is not a valid semantic version');
            }

            resolve([major, minor, patch]);
        });
    }

    private async isBotMinimumVersionFulfilled(botVersion: string): Promise<boolean> {
        if (!this.serverConfigService.requiredBotVersion) {
            return true;
        }

        try {
            const [
                requiredMajor,
                requiredMinor,
                requiredPatch
            ] = await this.extractSemanticVersion(this.serverConfigService.requiredBotVersion);

            const [major, minor, patch] = await this.extractSemanticVersion(botVersion);

            const isMinimumMajorVersionFulfilled = requiredMajor < major;
            const isMinimumMinorVersionFulfilled = requiredMinor < minor;
            const isMinimumPatchVersionFulfilled = requiredPatch < patch;

            const areMajorVersionsEqual = requiredMajor === major;
            const areMinorVersionsEqual = requiredMinor === minor;
            const arePatchVersionsEqual = requiredPatch === patch;

            return (
                isMinimumMajorVersionFulfilled
                || (areMajorVersionsEqual && isMinimumMinorVersionFulfilled)
                || (areMajorVersionsEqual && areMinorVersionsEqual && isMinimumPatchVersionFulfilled)
                || (areMajorVersionsEqual && areMinorVersionsEqual && arePatchVersionsEqual)
            );
        } catch (err) {
            this.logger.error('bot version error', err);
            throw new WsException(err);
        }
    }

    async validateBotWebsocketConnection({ client, isGuard }: ValidatorBotWsProps) {
        const { token, installationId, system, collection, version } = client.handshake.auth;

        this.validateParameterFromBot(token, 'empty token', client);

        const user = await this.validateToken(token)
            .catch((error) => {
                client.disconnect();
                this.logger.error('token validation error', error);
                throw new WsException('token user validation exception');
            });

        this.validateParameterFromBot(user, 'user does not exist', client);
        this.validateParameterFromBot(installationId, 'missing installationId in bot data', client);
        this.validateParameterFromBot(system, 'missing system in bot data', client);
        this.validateParameterFromBot(collection, 'missing collection in bot data', client);

        const collectionEntity = await this.botCollectionService.findById(collection);
        this.validateParameterFromBot(collectionEntity, 'collection with id from bot doesn\'t exist', client);

        const botSystem = await this.botSystemService.findByName(system);
        const mutableBotParams = { system: botSystem, collection: collectionEntity, version };
        const bot = await this.validateBot(installationId)
            .then(async (bot) => {
                const isVersionFullfiled = await this.isBotMinimumVersionFulfilled(version);
                if (!isVersionFullfiled) {
                    this.logger.warn(`Bot cannot be registered. Provided version ${version} does not fulfill minimum ${this.serverConfigService.requiredBotVersion}`);
                    throw new WsException(`Bot ${bot.installationId} cannot be registered. Version does not meet the minimum requirements.`);
                }

                return bot;
            })
            .then((bot) => {
                if (isGuard) return bot;
                return bot
                    ? this.registerBot(bot, mutableBotParams)
                    : this.registerNewBot({ installationId, user, ...mutableBotParams });
            })
            .catch((error) => {
                client.disconnect();
                this.logger.error('Bot validation error', error);
                throw new WsException('wrong installationId variable');
            });

        return { bot, user };
    }

    private validateParameterFromBot(parameter, exceptionMessage: string, client: Socket) {
        if (!parameter) {
            client.disconnect();
            throw new WsException(exceptionMessage);
        }
    }

    private validateBot(installationId: string) {
        return this.botService.findByInstallationId(installationId);
    }

    private registerNewBot({
        installationId, system, user, collection, version
    }: RegisterNewBotParams) {
        const bot = new BotEntity();
        bot.installationId = installationId;
        bot.system = system;
        bot.created = dayjs().toISOString();
        bot.status = BotStatus.CONNECTED;
        bot.lastConnected = dayjs().toISOString();
        bot.user = user;
        bot.collection = collection;
        bot.version = version;
        this.logger.log(`=> A new bot ${bot.installationId} has been registered`);
        return this.botService.save(bot).catch(() => {
            throw new WsException(`New bot ${bot.installationId} cannot be register`);
        });
    }

    private registerBot(bot: IBot, { system, collection, version }: MutableBotParams) {
        const botToUpdate = { ...bot };
        botToUpdate.lastConnected = dayjs().toISOString();
        botToUpdate.status = BotStatus.CONNECTED;
        botToUpdate.system = system;
        botToUpdate.collection = collection;
        botToUpdate.version = version;
        this.logger.log(`Bot ${bot.installationId} has been registered`);
        return this.botService.save(botToUpdate).catch(() => {
            throw new WsException(`Bot ${bot.installationId} cannot be register`);
        });
    }

    async unregisterBot(installationId: string) {
        const bot = await this.botService.findByInstallationId(installationId);
        bot.status = BotStatus.DISCONNECTED;
        this.logger.log(`Bot ${bot.installationId} is unregistered`);
        return this.botService.save(bot).catch(() => {
            throw new WsException(`Bot ${bot.installationId} cannot be unregistered`);
        });
    }
}

