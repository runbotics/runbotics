import { NotificationBot, NotificationProcess } from 'runbotics-common';

export enum ProcessNotificationTableFields {
    USER_EMAIL = 'userEmail',
    CUSTOM_EMAIL = 'customEmail',
    ACTIONS = 'actions',
    SUBSCRIBED_AT = 'subscribedAt'
}

export interface ProcessNotificationRow {
    id: string;
    [ProcessNotificationTableFields.USER_EMAIL]: string;
    [ProcessNotificationTableFields.CUSTOM_EMAIL]: string | '';
    [ProcessNotificationTableFields.SUBSCRIBED_AT]: NotificationProcess['createdAt'];
}

export enum BotNotificationTableFields {
    USER_EMAIL = 'userEmail',
    ACTIONS = 'actions',
    SUBSCRIBED_AT = 'subscribedAt'
}

export interface BotNotificationRow {
    id: string;
    customEmail: '',
    [BotNotificationTableFields.USER_EMAIL]: string;
    [BotNotificationTableFields.SUBSCRIBED_AT]: NotificationBot['createdAt'];
}
