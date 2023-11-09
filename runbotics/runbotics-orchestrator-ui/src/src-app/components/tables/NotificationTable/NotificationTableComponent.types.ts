import { IUser, UserBot, UserProcess } from 'runbotics-common';

export interface ProcessNotificationRow {
    id: number;
    userId: UserProcess['userId'];
    processId: UserProcess['processId'];
    user: IUser['email'];
    subscribedAt: UserProcess['subscribedAt'];
}

export interface BotNotificationRow {
    id: number;
    userId: UserBot['userId'];
    botId: UserBot['botId'];
    user: IUser['email'];
    subscribedAt: UserBot['subscribedAt'];
}
