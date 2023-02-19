import { Body, Controller, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/guards';
import { Logger } from 'src/utils/logger';
import { LifecycleNotificationBody, NotificationBody } from './notification.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH, NOTIFICATION_URL } from '../subscription/subscription.utils';
import { NotificationService } from './notification.service';

@Controller(NOTIFICATION_URL)
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Public()
    @Post(EMAIL_NOTIFICATION_URL_PATH.SINGLETON)
    async emailNotification(
        @Body() notificationBody: NotificationBody,
        @Query('validationToken') validationToken: string,
    ) {
        if (validationToken) {
            const validationWords = validationToken.split(' ');
            const requestId = validationWords[validationWords.length - 1];
            this.logger.log(`<= Received test request for email notification (Request-Id: ${requestId})`);
            return validationToken;
        }

        this.logger.log('=> Received email notifications ', notificationBody.value);

        const filteredNotifications = notificationBody.value
            .filter(notification => notification.clientState === EMAIL_NOTIFICATION_CLIENT_STATE);
    
        if (filteredNotifications.length === 0) {
            this.logger.warn('<= No email notifications were handled');
            return;
        }
        try {
            await this.notificationService.handleEmailNotifications(filteredNotifications);
        } catch (e) {
            return;
        }
        this.logger.log('<= Success: email notifications handled');
    }

    // https://learn.microsoft.com/en-us/graph/webhooks-lifecycle#:%7E:text=Renew%20the%20subscription.%20This%20reauthorizes%20and%20extends%20the%20expiration%20date.
    @Public()
    @Post(EMAIL_NOTIFICATION_URL_PATH.LIFECYCLE)
    emailLifecycleNotification(
        @Body() notificationBody: LifecycleNotificationBody, @Query('validationToken') validationToken: string
    ) {
        if (validationToken) {
            const validationWords = validationToken.split(' ');
            const requestId = validationWords[validationWords.length - 1];
            this.logger.log(`<= Received test request for email lifecycle notification (Request-Id: ${requestId})`);
            return validationToken;
        }
        
        this.logger.log('=> EMAIL NOTIFICATION LIFECYCLE', notificationBody);
    }
}

interface EmailMessage {
    id: string;
    resource: string;
    applicationId: string;
    changeType: string;
    clientState: string | null;
    notificationUrl: string;
    notificationQueryOptions: null;
    lifecycleNotificationUrl: string;
    expirationDateTime: string;
    creatorId: string;
    includeResourceData: null;
    latestSupportedTlsVersion: string;
    encryptionCertificate: null;
    encryptionCertificateId: null;
    notificationUrlAppId: string | null;
}