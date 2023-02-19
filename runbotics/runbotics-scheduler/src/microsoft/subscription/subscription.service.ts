import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import { MicrosoftAuthService } from '../microsoft-auth.service';
import {
    CreateSubscriptionRequest, CreateSubscriptionResponse, GetAllSubscriptionsResponse, GetSubscriptionResponse, Subscription,
} from './subscription.types';
import { EMAIL_NOTIFICATION_CLIENT_STATE, EMAIL_NOTIFICATION_URL_PATH } from './subscription.utils';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ServerConfigService } from 'src/config/serverConfig.service';
import { MicrosoftGraphClient } from '../microsoft-graph-client';
dayjs.extend(utc);

@Injectable()
export class SubscriptionService extends MicrosoftGraphClient implements OnModuleInit {
    private readonly logger = new Logger(SubscriptionService.name);

    constructor(
        readonly microsoftAuthService: MicrosoftAuthService,
        private readonly serverConfigService: ServerConfigService,
    ) {
        super(microsoftAuthService);
    }

    onModuleInit() {
        // this.createEmailSubscription()
        //     .then(() => {
        //         this.getAllSubscriptions()
        //             .then((response) => {
        //                 this.logger.log('ALL SUBS: ', response);
        //                 // response.value.forEach(sub => {
        //                 //     this.deleteSubscription(sub.id);
        //                 // });
        //             })
        //             .catch(e => {
        //                 this.logger.error('ALL SUBS DUPŁ, LECIMY DALEJ: ', e.message, e);
        //             });
        //     })
        //     .catch((e) => {
        //         this.logger.error('SUB DUPŁ, LECIMY DALEJ: ', e.message, e);
        //     });


        this.getAllSubscriptions()
            .then((response) => {
                this.logger.log('ALL SUBS: ', response);
                // response.value.forEach(sub => {
                //     this.deleteSubscription(sub.id);
                // });
            })
            .catch(e => {
                this.logger.error('ALL SUBS DUPŁ, LECIMY DALEJ: ', e.message, e);
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
        return this.client.api(`/subscriptions/${subscriptionId}/reauthorize`)
            .post(null);
    }

    // schedule new cron each time a subscription is created - max length under 3 days (4230mins) for emails (once a day?) 
    // https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions?view=graph-rest-1.0&tabs=javascript
    createSubscription(subscription: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> {
        return this.client.api('/subscriptions')
            .post(subscription);
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-delete?view=graph-rest-1.0&tabs=javascript
    deleteSubscription(subscriptionId: string): Promise<void> {
        return this.client.api(`/subscriptions/${subscriptionId}`)
            .delete();
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-list?view=graph-rest-1.0&tabs=javascript
    getAllSubscriptions(): Promise<GetAllSubscriptionsResponse> {
        return this.client.api('/subscriptions')
            .get();
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-get?view=graph-rest-1.0&tabs=javascript
    getSubscription(subscriptionId: string): Promise<GetSubscriptionResponse> {
        return this.client.api(`/subscriptions/${subscriptionId}`)
            .get();
    }

    // https://learn.microsoft.com/en-us/graph/api/subscription-update?view=graph-rest-1.0&tabs=javascript
    updateSubscription(
        subscriptionId: string, subscription: Pick<Subscription, 'expirationDateTime'>
    ): Promise<GetSubscriptionResponse> {
        return this.client.api(`/subscriptions/${subscriptionId}`)
            .update(subscription);
    }
}
