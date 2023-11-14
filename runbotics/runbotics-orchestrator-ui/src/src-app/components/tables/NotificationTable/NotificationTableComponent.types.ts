import { IUser, NotificationBot, NotificationProcess } from 'runbotics-common';

export interface ProcessNotificationRow {
    id: number;
    userId: NotificationProcess['userId'];
    processId: NotificationProcess['processId'];
    user: IUser['email'];
    subscribedAt: NotificationProcess['createdAt'];
}

export interface BotNotificationRow {
    id: number;
    userId: NotificationBot['userId'];
    botId: NotificationBot['botId'];
    user: IUser['email'];
    subscribedAt: NotificationBot['createdAt'];
}
