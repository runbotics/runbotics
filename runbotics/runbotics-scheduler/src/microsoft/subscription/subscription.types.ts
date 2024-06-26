export interface Subscription {
    '@odata.type': '#microsoft.graph.subscription';
    id: string;
    // https://learn.microsoft.com/en-us/graph/api/subscription-post-subscriptions?view=graph-rest-1.0&tabs=javascript#resources-examples
    resource: string;
    /**
     * @type string
     * @description Type of change event related to provided resource . Consists values 'created', 'updated or 'deleted' divided by comma
     * @example 'created,updated,deleted'
     */
    changeType: string;
    clientState: string;
    notificationUrl: string;
    expirationDateTime: string; // timestamp
    applicationId: string;
    creatorId: string;
    includeResourceData: boolean;
    lifecycleNotificationUrl: string;
    encryptionCertificate: string;
    encryptionCertificateId: string;
    latestSupportedTlsVersion: string;
    notificationQueryOptions: string;
    notificationUrlAppId: string;
}

export type CreateSubscriptionRequest = Pick<Subscription,
        | 'changeType' | 'notificationUrl' | 'resource' | 'expirationDateTime'
    >
    & Partial<Omit<Subscription,
        | 'changeType' | 'notificationUrl' | 'resource' | 'expirationDateTime'
        | '@odata.type' | 'id' | 'creatorId' | 'includeResourceData'>>;

export type CreateSubscriptionResponse = Pick<Subscription, 'id'
    | 'resource' | 'applicationId' | 'changeType' | 'clientState'
    | 'notificationUrl' | 'expirationDateTime' | 'creatorId' | 'latestSupportedTlsVersion'
    > & {
        '@odata.context': string;
        notificationContentType: string
    };

export type GetSubscriptionResponse = Omit<Subscription, '@odata.type' | 'notificationQueryOptions'>;

export interface GetAllSubscriptionsResponse {
    '@odata.context': string;
    value: GetSubscriptionResponse[];
}


export interface SubscriptionValidation {
    validEmailSubscriptions: GetSubscriptionResponse[];
    invalidSubscriptions: GetSubscriptionResponse[];
}
