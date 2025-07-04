import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection } from 'typeorm';
import jwt, { JwtHeader, JwtPayload, Secret, SigningKeyCallback } from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ServerConfigService } from '#/config/server-config';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';
import { BotService } from '#/scheduler-database/bot/bot.service';
import { BotSystemService } from '#/scheduler-database/bot-system/bot-system.service';
import { BotCollectionService } from '#/scheduler-database/bot-collection/bot-collection.service';
import { UserService } from '#/scheduler-database/user/user.service';
import { JWTPayload } from '#/types';
import { Logger } from '#/utils/logger';
import { BotStatus, BotSystemType, IBot, Role } from 'runbotics-common';
import { MicrosoftSSOUserDto, MutableBotParams, RegisterNewBotParams } from './auth.service.types';
import dayjs from 'dayjs';
import { User } from '#/scheduler-database/user/user.entity';

interface ValidatorBotWsProps {
    client: Socket;
    isGuard?: boolean;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private jwksClient: JwksClient;

    constructor(
        private readonly userService: UserService,
        private readonly botService: BotService,
        private readonly botSystemService: BotSystemService,
        private readonly botCollectionService: BotCollectionService,
        private readonly serverConfigService: ServerConfigService,
        private readonly connection: Connection,
    ) {
        this.jwksClient = jwksClient({
            jwksUri: this.serverConfigService.microsoftAuth.discoveryKeysUri,
        });
    }

    validatePayload(payload: JWTPayload) {
        return this.userService.findByEmail(payload.sub);
    }

    validateToken(token: string) {
        const secret = this.serverConfigService.secret;
        let jwtPayload;
        try {
            jwtPayload = jwt.verify(token, secret) as JWTPayload;
        } catch (e: unknown) {
            return Promise.reject(e);
        }
        return this.validatePayload(jwtPayload);
    }

    parseToken(token: string) {
        let jwtPayload;
        try {
            jwtPayload = jwt.decode(token) as JWTPayload;
        } catch (e: unknown) {
            return Promise.reject(e);
        }
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

    validateMicrosoftAccessToken(idToken: string) {
        return new Promise<JwtPayload | string>((resolve, reject) => {
            jwt.verify(
                idToken,
                this.getSigningKey.bind(this),
                {
                    algorithms: ['RS256'],
                    complete: false,
                },
                (err, decoded) => {
                    if (err) {
                        console.error(err);
                        reject(new UnauthorizedException('Invalid token'));
                    } else {
                        resolve(decoded);
                    }
                }
            );
        });
    }

    async handleMicrosoftSSOUserAuth(msUserAuthDto: MicrosoftSSOUserDto) {
        const user = await this.userService.findByEmail(msUserAuthDto.email);
        if (!user) {
            return this.registerMicrosoftSSOUser(msUserAuthDto);
        }
        return this.signInMicrosoftSSOUser(user);
    }

    private signInMicrosoftSSOUser({ email, authorities }: User) {
        const roles = authorities.map((authority) => authority.name);

        return this.signNewIdToken(email, roles);
    }

    private async registerMicrosoftSSOUser(msUserAuthDto: MicrosoftSSOUserDto) {
        const { email, authorities } =
            await this.userService.createMicrosoftSSOUser(msUserAuthDto);
        const roles = authorities.map((authority) => authority.name);

        return this.signNewIdToken(email, roles);
    }

    private signNewIdToken(email: string, roles = [Role.ROLE_USER]) {
        const secret = this.serverConfigService.secret;
        const payload = {
            sub: email,
            auth: roles.join(','),
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS512',
            expiresIn: '1d',
        });
    }

    private getSigningKey(header: JwtHeader, callback: SigningKeyCallback) {
        this.jwksClient.getSigningKey(header.kid, (err, key) => {
            if (err) {
                return callback(err, null);
            }
            const signingKey = key.getPublicKey();
            callback(null, signingKey);
        });
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
        } catch (err: any) {
            this.logger.error('bot version error', err);
            throw new WsException(err);
        }
    }

    async validateBotWebsocketConnection({ client, isGuard }: ValidatorBotWsProps) {
        return this.validateBotConnection({client, isGuard})
            .catch((error) => {
                this.logger.error('Bot connection error', error);
                return null;
            });
    }

    async validateBotConnection({ client, isGuard }: ValidatorBotWsProps) {
        const { token, installationId, system, collection, version } = client.handshake.auth;

        this.validateParameterFromBot(token, 'empty token', client);

        const user = await (isGuard ? this.parseToken.bind(this) : this.validateToken.bind(this))(token)
            .catch((error) => {
                client.disconnect();
                this.logger.error('token validation error', error);
                throw new WsException('token user validation exception');
            });

        this.validateParameterFromBot(user, 'user does not exist', client);
        this.validateParameterFromBot(installationId, 'missing installationId in bot data', client);

        this.validateParameterFromBot(system, 'missing system in bot data', client);
        this.validateBotSystem(system, client);

        this.validateParameterFromBot(collection, 'missing collection in bot data', client);

        const collectionEntity = await this.botCollectionService.getById(collection);
        this.validateParameterFromBot(collectionEntity, 'collection with id from bot doesn\'t exist', client);

        const botSystem = await this.botSystemService.findByName(system);
        const mutableBotParams = { system: botSystem, collection: collectionEntity, version, user };
        const bot = await this.validateBot(installationId)
            .then(async (bot) => {
                const isVersionFulfilled = await this.isBotMinimumVersionFulfilled(version);
                if (!isVersionFulfilled) {
                    this.logger.warn(`Bot cannot be registered. Provided version ${version} does not fulfill minimum ${this.serverConfigService.requiredBotVersion}`);
                    throw new WsException(`Bot ${bot.installationId} cannot be registered. Version does not meet the minimum requirements.`);
                }
                return bot;
            })
            .then((bot) => {
                if (isGuard) return bot;
                return bot
                    ? this.registerBot(bot, mutableBotParams)
                    : this.registerNewBot({ installationId, ...mutableBotParams });
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

    private validateBotSystem(system: BotSystemType, client: Socket): void {
        if (Object.values(BotSystemType).includes(system)) return;
        client.disconnect();
        throw new WsException(`Bot system (${system}) is incompatible`);
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
        bot.tenantId = user.tenantId;
        bot.version = version;
        this.logger.log(`=> A new bot ${bot.installationId} has been registered`);
        return this.botService.save(bot).catch(() => {
            throw new WsException(`New bot ${bot.installationId} cannot be register`);
        });
    }

    private registerBot(bot: IBot, { system, collection, version, user }: MutableBotParams) {
        const botToUpdate = { ...bot };
        botToUpdate.user = user;
        botToUpdate.lastConnected = dayjs().toISOString();
        botToUpdate.status = BotStatus.CONNECTED;
        botToUpdate.system = system;
        botToUpdate.collection = collection;
        botToUpdate.version = version;
        botToUpdate.tenantId = user.tenantId;
        this.logger.log(`Bot ${bot.installationId} has been registered`);
        return this.botService.save(botToUpdate).catch(() => {
            throw new WsException(`Bot ${bot.installationId} cannot be register`);
        });
    }

    async unregisterBot(installationId: string) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const bot = await queryRunner.manager
                .findOne(BotEntity, { where: { installationId: installationId }, relations: ['user', 'system', 'collection']});

            bot.status = BotStatus.DISCONNECTED;

            await queryRunner.manager
                .createQueryBuilder()
                .update(BotEntity)
                .set({
                   ...bot,
                })
                .where('id = :id', { id: bot.id })
                .execute();

            await queryRunner.commitTransaction();
            this.logger.log(`Bot ${bot.installationId} has been unregistered`);
            return bot;
        } catch (err: unknown) {
            this.logger.error('Process instance update error: rollback', err);
            await queryRunner.rollbackTransaction();
            throw new WsException(`Bot ${installationId} cannot be unregistered`);
        } finally {
            await queryRunner.release();
        }
    }
}

