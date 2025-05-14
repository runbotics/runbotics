import { NotificationProcess } from 'runbotics-common';

export enum NotificationTableFields {
    EMAIL = 'userEmail',
    ACTIONS = 'actions',
    SUBSCRIBED_AT = 'subscribedAt'
}

export interface NotificationRow {
    id: string;
    [NotificationTableFields.EMAIL]: string;
    [NotificationTableFields.SUBSCRIBED_AT]: NotificationProcess['createdAt'];
}
