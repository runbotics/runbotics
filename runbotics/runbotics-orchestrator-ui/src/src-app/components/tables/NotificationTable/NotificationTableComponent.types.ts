import { NotificationBot, NotificationProcess } from 'runbotics-common';

export interface ProcessNotificationRow {
    id: string;
    userEmail: string;
    email: string | '';
    subscribedAt: NotificationProcess['createdAt'];
}

export interface BotNotificationRow {
    id: string;
    userEmail: string;
    email: ''; // Bot notifications for email other than user's email are unsupported.
    subscribedAt: NotificationBot['createdAt'];
}
