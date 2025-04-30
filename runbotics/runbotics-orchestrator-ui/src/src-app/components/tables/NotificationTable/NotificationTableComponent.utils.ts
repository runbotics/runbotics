import { BotNotificationRow, ProcessNotificationRow } from './NotificationTableComponent.types';

export const ROWS_PER_PAGE = [10, 20, 30];

export enum DefaultPageValue {
    PAGE_SIZE = 10,
    PAGE = 0,
}

export type SubscriberBotTableFields = (keyof Omit<BotNotificationRow, 'email'>) | 'actions'; // omit email, as it's always empty
export type SubscriberProcessTableFields = (keyof ProcessNotificationRow) | 'actions';
