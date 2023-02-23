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
    subscriptionExpirationDateTime: string; // timestamp UTC
    resource: string;
    resourceData: {
        '@odata.id': string;
        '@odata.type': string;
        id: string;
    };
    clientState: string;
    sequence: null;
    encryptedContent: null;
    organizationId: string;
}

export interface MissedLifecycleNotificationEvent extends Omit<LifecycleNotification, 'lifecycleEvent'> {
    lifecycleEvent: 'missed';
}

export interface ExpiredLifecycleNotificationEvent extends Omit<LifecycleNotification, 'lifecycleEvent'> {
    lifecycleEvent: 'reauthorizationRequired';
}

export interface LifecycleNotificationBody {
    value: LifecycleNotification[];
}

export interface LifecycleEventDivision {
    missed: MissedLifecycleNotificationEvent[];
    expired: ExpiredLifecycleNotificationEvent[];
}
