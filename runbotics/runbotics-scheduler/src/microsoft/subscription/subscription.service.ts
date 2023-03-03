import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import {
    CreateSubscriptionRequest, CreateSubscriptionResponse, GetAllSubscriptionsResponse, GetSubscriptionResponse, Subscription, SubscriptionValidation,
} from './subscription.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH, initialSubscriptionsValidation } from './subscription.utils';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ServerConfigService } from 'src/config/server-config/server-config.service';
import { MicrosoftGraphService } from '../microsoft-graph/microsoft-graph.service';
dayjs.extend(utc);

@Injectable()
export class SubscriptionService implements OnModuleInit {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(
        private readonly serverConfigService: ServerConfigService,
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    onModuleInit() {       
        this.initializeEmailTriggerSubscription();
    }

    async createEmailTriggerSubscription() {
        this.logger.log('Creating new email subscription');
        const twoDaysFromNowUTC = dayjs.utc().add(2, 'days').format();

        const notificationUrl = this.serverConfigService.entrypointUrl + EMAIL_NOTIFICATION_URL_PATH.FULL;
        const lifecycleNotificationUrl = this.serverConfigService.entrypointUrl + EMAIL_NOTIFICATION_URL_PATH.FULL_LIFECYCLE;

        const subscription: CreateSubscriptionRequest = {
            changeType: 'created',
            // https://learn.microsoft.com/en-us/graph/outlook-change-notifications-overview?tabs=javascript#example-3-create-a-subscription-to-get-change-notifications-with-resource-data-for-a-message-based-on-a-condition-preview
            resource: `me/mailFolders('${this.serverConfigService.emailTriggerConfig.mailbox || 'Inbox'}')/messages`,
            notificationUrl,
            expirationDateTime: twoDaysFromNowUTC,
            clientState: EMAIL_NOTIFICATION_CLIENT_STATE,
            lifecycleNotificationUrl,
        };

        try {
            const createSubscriptionResponse = await this.createSubscription(subscription);

            this.logger.log(`Success: Email subscription created (${createSubscriptionResponse.id})`);

            return createSubscriptionResponse;
        } catch (error: any) {
            this.logger.error('Failed to create email subscription:', error.message);
        }
    }

    // https://learn.microsoft.com/en-us/graph/webhooks-lifecycle#actions-to-take-2
    reauthorizeSubscription(subscriptionId: string) {
        return this.microsoftGraphService
            .post(`/subscriptions/${subscriptionId}/reauthorize`, null);
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions?view=graph-rest-1.0&tabs=javascript
    createSubscription(subscription: CreateSubscriptionRequest) {
        return this.microsoftGraphService
            .post<CreateSubscriptionResponse>('/subscriptions', subscription);
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-delete?view=graph-rest-1.0&tabs=javascript
    deleteSubscription(subscriptionId: string): Promise<void> {
        return this.microsoftGraphService
            .delete(`/subscriptions/${subscriptionId}`);
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-list?view=graph-rest-1.0&tabs=javascript
    getAllSubscriptions() {
        return this.microsoftGraphService
            .get<GetAllSubscriptionsResponse>('/subscriptions');
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-get?view=graph-rest-1.0&tabs=javascript
    getSubscription(subscriptionId: string) {
        return this.microsoftGraphService
            .get<GetSubscriptionResponse>(`/subscriptions/${subscriptionId}`);
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-update?view=graph-rest-1.0&tabs=javascript
    updateSubscription(
        subscriptionId: string,
        subscription: Pick<Subscription, 'expirationDateTime'>,
    ) {
        return this.microsoftGraphService
            .patch<GetSubscriptionResponse>(`/subscriptions/${subscriptionId}`, subscription);
    }

    private initializeEmailTriggerSubscription() {
        this.getAllSubscriptions()
            .then((subscriptions) => {
                const { invalidSubscriptions, validEmailSubscriptions } = this.validateSubscriptions(subscriptions.value);

                invalidSubscriptions
                    .forEach(subscription => this.deleteSubscription(subscription.id));

                if (validEmailSubscriptions.length === 0) {
                    this.logger.log('No email trigger subscriptions found - initializing new one');
                    this.createEmailTriggerSubscription();
                } else
                    this.logger.log('Email trigger subscription already exists - no action has been taken');
            })
            .catch(e => {
                this.logger.error(`Failed to sync email subscriptions: ${e.message}`);
            });
    }

    private validateSubscriptions(subscriptions: GetSubscriptionResponse[]) {
        return subscriptions
            .reduce<SubscriptionValidation>((acc, subscription) => {
                const completeEmailNotificationUrl = this.serverConfigService.entrypointUrl
                    + EMAIL_NOTIFICATION_URL_PATH.FULL;
                const completeEmailLifecycleNotificationUrl = this.serverConfigService.entrypointUrl
                    + EMAIL_NOTIFICATION_URL_PATH.FULL_LIFECYCLE;

                const isValidEmailSubscription = subscription.notificationUrl === completeEmailNotificationUrl
                    && subscription.lifecycleNotificationUrl === completeEmailLifecycleNotificationUrl;
                const isInvalidSubscription = !subscription.notificationUrl.includes(this.serverConfigService.entrypointUrl)
                    || !subscription.lifecycleNotificationUrl.includes(this.serverConfigService.entrypointUrl);

                if (isValidEmailSubscription)
                    acc.validEmailSubscriptions.push(subscription);
                if (isInvalidSubscription)
                    acc.invalidSubscriptions.push(subscription);

                return acc;
            }, initialSubscriptionsValidation);
    }
}
