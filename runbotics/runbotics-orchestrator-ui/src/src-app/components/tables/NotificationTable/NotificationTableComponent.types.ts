import { IUser, NotificationBot, NotificationProcess } from 'runbotics-common';

export interface ProcessNotificationRow {
    id: string;
    user: IUser['email'];
    subscribedAt: NotificationProcess['createdAt'];
}

export interface BotNotificationRow {
    id: string;
    user: IUser['email'];
    subscribedAt: NotificationBot['createdAt'];
}
