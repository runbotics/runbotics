export interface ProcessNotificationSubscriber {
    id: string;
    createdAt: string;
    customEmail: string;
    userId: string;
    processId: string;
    userEmail: string;
}

export interface ProcessSubscriptionStatisticsState {
    subscriptions: ProcessNotificationSubscriber[];
    loading: boolean;
}
