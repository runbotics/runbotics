import { Body, Controller, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Public } from 'src/auth/guards';
import { Logger } from 'src/utils/logger';
import { LifecycleNotificationBody, NotificationBody } from './notification.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH, NOTIFICATION_URL } from '../subscription/subscription.utils';
import { NotificationService } from './notification.service';
import { Response } from 'express';
import { ServerConfigService } from 'src/config/server-config';

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
                && this.serverConfigService.microsoftAuth.tenantId === notification.tenantId);
    
        if (filteredNotifications.length === 0) {
            this.logger.warn('<= No email notifications were handled');
            return;
        }

        await this.notificationService.handleEmailNotifications(filteredNotifications);

        this.logger.log('<= Success: email notifications handled');
        
        return;
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
                && notification.organizationId === this.serverConfigService.microsoftAuth.tenantId);
    
        if (filteredNotifications.length === 0) {
            this.logger.warn('<= No email lifecycle notifications were handled');
            return;
        }

        await this.notificationService.handleLifecycleEmailNotifications(filteredNotifications);
        
        this.logger.log('<= Success: email lifecycle notifications handled');
        return;
    }
}
