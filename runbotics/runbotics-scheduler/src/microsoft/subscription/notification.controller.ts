import { Body, Controller, Post, Query } from '@nestjs/common';
import { Public } from 'src/auth/guards';
import { Logger } from 'src/utils/logger';
import { LifecycleNotificationBody, NotificationBody } from './notification.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH, NOTIFICATION_URL } from './subscription.utils';

@Controller(NOTIFICATION_URL)
export class NotificationController {
    private readonly logger = new Logger(NotificationController.name);

    @Public()
    @Post(EMAIL_NOTIFICATION_URL_PATH.SINGLETON)
    emailNotification(@Body() notificationBody: NotificationBody, @Query('validationToken') validationToken: string) {
        if (validationToken) {
            const validationWords = validationToken.split(' ');
            const requestId = validationWords[validationWords.length - 1];
            this.logger.log(`<= Received test request for email notification (Request-Id: ${requestId})`);
            return validationToken;
        }
        // TODO: verify client state EMAIL_NOTIFICATION_CLIENT_STATE
        this.logger.log('=> Received email notifications');

        const filteredNotifications = notificationBody.value
            .filter(notification => notification.clientState === EMAIL_NOTIFICATION_CLIENT_STATE);
    
        if (filteredNotifications.length === 0) {
            this.logger.warn('<= No email notifications were handled');
            return;
        }

        const dupa = 123;
        // filteredNotifications[0].resourceData.id - id wiadomości
    }

    // https://learn.microsoft.com/en-us/graph/webhooks-lifecycle#:%7E:text=Renew%20the%20subscription.%20This%20reauthorizes%20and%20extends%20the%20expiration%20date.
    @Public()
    @Post(EMAIL_NOTIFICATION_URL_PATH.LIFECYCLE)
    dupa(@Body() notificationBody: LifecycleNotificationBody, @Query('validationToken') validationToken: string) {
        if (validationToken) {
            const validationWords = validationToken.split(' ');
            const requestId = validationWords[validationWords.length - 1];
            this.logger.log(`<= Received test request for email lifecycle notification (Request-Id: ${requestId})`);
            return validationToken;
        }
        
        this.logger.log('=> EMAIL NOTIFICATION LIFECYCLE', notificationBody);
    }
}