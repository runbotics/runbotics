import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import {
    CreateSubscriptionRequest, CreateSubscriptionResponse, GetAllSubscriptionsResponse, GetSubscriptionResponse, Subscription,
} from './subscription.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH } from './subscription.utils';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { MicrosoftGraphService } from '../microsoft-graph.service';
dayjs.extend(utc);

@Injectable()
export class SubscriptionService implements OnModuleInit {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(
        private readonly serverConfigService: ServerConfigService,
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    onModuleInit() {
        // this.createEmailSubscription();

        this.getAllSubscriptions()
            .then((response) => {
                this.logger.log('ALL SUBS: ', response);
                // response.value.forEach(sub => {
                //     this.deleteSubscription(sub.id);
                // });
            });
    }

    async createEmailSubscription(inbox?: string) {
        this.logger.log('Creating new email subscription');
        const dayFromNowUTC = dayjs.utc().add(2, 'day').format();

        const notificationUrl = this.serverConfigService.entrypointUrl + EMAIL_NOTIFICATION_URL_PATH.FULL;
        const lifecycleNotificationUrl = this.serverConfigService.entrypointUrl + EMAIL_NOTIFICATION_URL_PATH.FULL_LIFECYCLE;

        const subscription: CreateSubscriptionRequest = {
            changeType: 'created',
            // dodac filter tylko dla @all-for-one
            // https://learn.microsoft.com/en-us/graph/outlook-change-notifications-overview?tabs=javascript#example-3-create-a-subscription-to-get-change-notifications-with-resource-data-for-a-message-based-on-a-condition-preview
            resource: `me/mailFolders('${inbox || 'Inbox'}')/messages`,
            notificationUrl,
            expirationDateTime: dayFromNowUTC,
            clientState: EMAIL_NOTIFICATION_CLIENT_STATE,
            lifecycleNotificationUrl,
        };

        const createSubscriptionResponse = await this.createSubscription(subscription);

        this.logger.log(`Success: Email subscription created (${createSubscriptionResponse.id})`);

        return createSubscriptionResponse;
    }

    // https://learn.microsoft.com/en-us/graph/webhooks-lifecycle#actions-to-take-2
    reauthorizeSubscription(subscriptionId: string) {
        return this.microsoftGraphService.api(`/subscriptions/${subscriptionId}/reauthorize`)
            .post(null);
    }

    // schedule new cron each time a subscription is created - max length under 3 days (4230mins) for emails (once a day?) 
    // https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions?view=graph-rest-1.0&tabs=javascript
    createSubscription(subscription: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
        return this.microsoftGraphService.api('/subscriptions')
            .post(subscription);
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-delete?view=graph-rest-1.0&tabs=javascript
    deleteSubscription(subscriptionId: string): Promise<void> {
        return this.microsoftGraphService.api(`/subscriptions/${subscriptionId}`)
            .delete();
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-list?view=graph-rest-1.0&tabs=javascript
    getAllSubscriptions(): Promise<GetAllSubscriptionsResponse> {
        return this.microsoftGraphService.api('/subscriptions')
            .get();
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-get?view=graph-rest-1.0&tabs=javascript
    getSubscription(subscriptionId: string): Promise<GetSubscriptionResponse> {
        return this.microsoftGraphService.api(`/subscriptions/${subscriptionId}`)
            .get();
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-update?view=graph-rest-1.0&tabs=javascript
    updateSubscription(
        subscriptionId: string, subscription: Pick<Subscription, 'expirationDateTime'>
    ): Promise<GetSubscriptionResponse> {
        return this.microsoftGraphService.api(`/subscriptions/${subscriptionId}`)
            .update(subscription);
    }
}
