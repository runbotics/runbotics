import { Body, Controller, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Public } from '#/auth/guards';
import { Logger } from '#/utils/logger';
import { LifecycleNotificationBody, NotificationBody } from './notification.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH, NOTIFICATION_URL } from '../subscription/subscription.utils';
import { NotificationService } from './notification.service';
import { Response } from 'express';
import { ServerConfigService } from '#/config/server-config';

@Controller(NOTIFICATION_URL)
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(
        private readonly notificationService: NotificationService,
        private readonly serverConfigService: ServerConfigService,
    ) {}

    @Public()
    @Post(EMAIL_NOTIFICATION_URL_PATH.MAIN)
    async emailNotification(
        @Body() notificationBody: NotificationBody,
        @Query('validationToken') validationToken: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        if (validationToken) {
            const validationWords = validationToken.split(' ');
            const requestId = validationWords[validationWords.length - 1];
            this.logger.log(`<= Received test request for email notification (Request-Id: ${requestId})`);

            response
                .contentType('text');
            return validationToken;
        }

        this.logger.log(`=> Received ${notificationBody.value.length} email notification(s)`);

        const filteredNotifications = notificationBody.value
            .filter(notification => notification.clientState === EMAIL_NOTIFICATION_CLIENT_STATE
                && (!this.serverConfigService.microsoftAuth.tenantId
                    || this.serverConfigService.microsoftAuth.tenantId === notification.tenantId));
    
        if (filteredNotifications.length === 0) {
            this.logger.warn('<= No email notifications were handled');
            return;
        }

        await this.notificationService.handleEmailNotifications(filteredNotifications)
            .then(() => {
                this.logger.log('<= Success: email notifications handled');
            })
            .catch(e => {
                this.logger.error('<= Failed to handle email notifications -', e);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }

    // https://learn.microsoft.com/en-us/graph/webhooks-lifecycle#:%7E:text=Renew%20the%20subscription.%20This%20reauthorizes%20and%20extends%20the%20expiration%20date.
    @Public()
    @Post(EMAIL_NOTIFICATION_URL_PATH.LIFECYCLE)
    async emailLifecycleNotification(
        @Body() notificationBody: LifecycleNotificationBody,
        @Query('validationToken') validationToken: string,
        @Res({ passthrough: true }) response: Response,
    ) {
        if (validationToken) {
            const validationWords = validationToken.split(' ');
            const requestId = validationWords[validationWords.length - 1];
            this.logger.log(`<= Received test request for email lifecycle notification (Request-Id: ${requestId})`);

            response
                .contentType('text');
            return validationToken;
        }

        this.logger.log(`=> Received ${notificationBody.value.length} email lifecycle notification(s)`);

        const filteredNotifications = notificationBody.value
            .filter(notification => notification.clientState === EMAIL_NOTIFICATION_CLIENT_STATE
                && (!this.serverConfigService.microsoftAuth.tenantId
                    || this.serverConfigService.microsoftAuth.tenantId === notification.organizationId));
    
        if (filteredNotifications.length === 0) {
            this.logger.warn('<= No email lifecycle notifications were handled');
            return;
        }

        await this.notificationService.handleLifecycleEmailNotifications(filteredNotifications)
            .then(() => {
                this.logger.log('<= Success: email lifecycle notifications handled');
            })
            .catch(e => {
                this.logger.error('<= Failed to handle email lifecycle notifications -', e);
                response.status(HttpStatus.INTERNAL_SERVER_ERROR);
            });
    }
}
