import { IUser, NotificationBot, NotificationProcess } from 'runbotics-common';

export interface ProcessNotificationRow {
    id: number;
    user: IUser['email'];
    subscribedAt: NotificationProcess['createdAt'];
}

export interface BotNotificationRow {
    id: number;
    user: IUser['email'];
    subscribedAt: NotificationBot['createdAt'];
}
