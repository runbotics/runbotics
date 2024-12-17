import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, ParseUUIDPipe, Post, UseInterceptors } from '@nestjs/common';

import { TenantInterceptor } from '#/utils/interceptors/tenant.interceptor';
import { ZodValidationPipe } from '#/utils/pipes/zod-validation.pipe';
import { User as UserDecorator } from '#/utils/decorators/user.decorator';
import { User } from '#/scheduler-database/user/user.entity';

import { CreateNotificationProcessDto, createNotificationProcessSchema } from './dto/create-notification-process.dto';
import { NotificationProcessService } from './notification-process.service';


@UseInterceptors(TenantInterceptor)
@Controller('/api/scheduler/tenants/:tenantId/notifications-process')
export class NotificationProcessController {
    private readonly logger = new Logger(NotificationProcessController.name);

    constructor(
        private readonly notificationProcessService: NotificationProcessService
    ) {}

    @Get('processes/:processId')
    getAllNotificationsByProcessId(
        @Param('processId', ParseIntPipe) processId: number,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to get all process notifications by process id: ', processId);
        return this.notificationProcessService.getAllByProcessIdAndUser(processId, user);
    }

    @Post()
    createNotification(
        @Body(new ZodValidationPipe(createNotificationProcessSchema))
        notificationProcessDto: CreateNotificationProcessDto,
        @UserDecorator() user: User
    ) {
        this.logger.log(`REST request to create process notification by user id: ${user.id}`);
        return this.notificationProcessService.create(notificationProcessDto, user);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteNotification(
        @Param('id', ParseUUIDPipe) id: string,
        @UserDecorator() user: User,
    ) {
        this.logger.log('REST request to delete process notification by id: ', id);
        await this.notificationProcessService.delete(id, user.id);
    }
}