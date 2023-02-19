export interface Notification {
    subscriptionId: string;
    subscriptionExpirationDateTime: string; // timestamp UTC
    changeType: string;
    resource: string;
    resourceData: {
        '@odata.etag': string;
        '@odata.id': string;
        '@odata.type': string;
        id: string;
    };
    clientState: string;
    tenantId: string;
}

export interface NotificationBody {
    value: Notification[];
}

export interface LifecycleNotification {
    lifecycleEvent: 'reauthorizationRequired' | 'missed' | 'subscriptionRemoved';
    subscriptionId: string;
    resource: string;
    clientState: string;
    sequence: null;
    resourceData: {
        '@odata.id': string;
        '@odata.type': string;
        id: string;
    };
    encryptedContent: null;
    organizationId: string;
    subscriptionExpirationDateTime: string; // timestamp UTC
}

export interface LifecycleNotificationBody {
    value: LifecycleNotification[];
}