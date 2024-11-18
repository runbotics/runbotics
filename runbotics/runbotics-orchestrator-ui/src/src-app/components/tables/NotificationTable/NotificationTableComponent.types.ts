import { UserDto, NotificationBot, NotificationProcess } from 'runbotics-common';

export interface ProcessNotificationRow {
    id: string;
    user: UserDto['email'];
    subscribedAt: NotificationProcess['createdAt'];
}

export interface BotNotificationRow {
    id: string;
    user: UserDto['email'];
    subscribedAt: NotificationBot['createdAt'];
}
