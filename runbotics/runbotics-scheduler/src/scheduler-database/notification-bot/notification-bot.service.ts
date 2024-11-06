import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Role } from 'runbotics-common';

import { NotificationBot } from './notification-bot.entity';
import { CreateNotificationBotDto } from './dto/create-notification-bot.dto';

import { UserEntity } from '#/database/user/user.entity';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';
import { isTenantAdmin } from '#/utils/authority.utils';


@Injectable()
export class NotificationBotService {
    private readonly logger = new Logger(NotificationBotService.name);

    constructor(
        @InjectRepository(NotificationBot)
        private readonly notificationBotRepository: Repository<NotificationBot>,
        @InjectRepository(BotEntity)
        private readonly botRepository: Repository<BotEntity>,
    ) {}

    async getAllByBotId(botId: number, user: UserEntity) {
        const bot = await this.checkBotAccessAndGetById(
            botId, user
        );

        return this.notificationBotRepository
            .find({ where: { bot: { id: bot.id } }, relations: ['user']})
            .then(bots => bots.map(this.formatToDTO));
    }

    async create(
        createNotificationBotDto: CreateNotificationBotDto,
        user: UserEntity
    ) {
        const bot = await this.checkBotAccessAndGetById(
            createNotificationBotDto.botId, user
        );

        const newNotification = new NotificationBot();
        newNotification.bot = bot;
        newNotification.user = user;
        newNotification.type = createNotificationBotDto.type;

        return this.notificationBotRepository
            .save(newNotification)
            .then(this.formatToDTO);
    }

    async delete(notificationBotId: string, user: UserEntity) {
        const findOptions = {
            id: notificationBotId,
            ...(!isTenantAdmin(user) && { user: { id: user.id } })
        };

        await this.notificationBotRepository
            .findOneByOrFail(findOptions).catch(() => {
                throw new BadRequestException('Cannot delete bot notification');
            });

        await this.notificationBotRepository
            .delete(findOptions);
    }

    private formatToDTO(notificationBot: NotificationBot) {
        return {
            type: notificationBot.type,
            id: notificationBot.id,
            user: {
                id: notificationBot.user.id,
                login: notificationBot.user.login
            },
            createdAt: notificationBot.createdAt
        };
    }

    private async checkBotAccessAndGetById(botId: number, user: UserEntity) {
        return user.authorities.find(authority => authority.name === Role.ROLE_TENANT_ADMIN)
            ? await this.botRepository
                .createQueryBuilder('bot')
                .leftJoin('bot.collection', 'collection')
                .where('bot.id = :botId', { botId })
                .setParameter('userId', user.id)
                .andWhere('collection.tenantId = :tenantId', { tenantId: user.tenantId })
                .getOneOrFail().catch(() => {
                    throw new NotFoundException();
                })
            : await this.botRepository
                .createQueryBuilder('bot')
                .leftJoin('bot.collection', 'collection')
                .leftJoin('collection.users', 'user')
                .where('bot.id = :botId', { botId })
                .setParameter('userId', user.id)
                .andWhere('collection.tenantId = :tenantId', { tenantId: user.tenantId })
                .andWhere(new Brackets(qb => {
                    qb.where('bot.user.id = :userId')
                    .orWhere('collection.publicBotsIncluded = true')
                    .orWhere('collection.createdByUser.id = :userId')
                    .orWhere('user.id = :userId');
                })).getOneOrFail().catch(() => {
                    throw new NotFoundException();
                });
    }
}
