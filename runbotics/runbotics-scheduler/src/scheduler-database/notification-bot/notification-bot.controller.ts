import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, ParseUUIDPipe, Post, UseInterceptors } from '@nestjs/common';

import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User } from '#/utils/decorators/user.decorator';
import { User as UserEntity } from '#/scheduler-database/user/user.entity';

import { createNotificationBotSchema, CreateNotificationBotDto } from './dto/create-notification-bot.dto';
import { NotificationBotService } from './notification-bot.service';



@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/notifications-bot')
export class NotificationBotController {
    private readonly logger = new Logger(NotificationBotController.name);

    constructor(
        private readonly notificationBotService: NotificationBotService
    ) {}

    @Get('bots/:botId')
    getAllNotificationsByBotId(
        @Param('botId', ParseIntPipe) botId: number,
        @User() user: UserEntity,
    ) {
        this.logger.log('REST request to get all bot notifications by bot id: ', botId);
        return this.notificationBotService.getAllByBotIdAndUser(botId, user);
    }

    @Post()
    createNotification(
        @Body(new ZodValidationPipe(createNotificationBotSchema))
        notificationBotDto: CreateNotificationBotDto,
        @User() user: UserEntity
    ) {
        this.logger.log(`REST request to create bot notification by user id: ${user.id}`);
        return this.notificationBotService.create(notificationBotDto, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNotification(
        @Param('id', ParseUUIDPipe) id: string,
        @User() user: UserEntity,
    ) {
        this.logger.log('REST request to delete bot notification by id: ', id);
        await this.notificationBotService.delete(id, user);
    }
}