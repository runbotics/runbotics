import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateNotificationBotDto, IBot, NotificationBot } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import Axios from '#src-app/utils/axios';
import { Page } from '#src-app/utils/types/page';

const BOT_NOTIFICATION_PATH = 'notifications-bot';

const BOT_PATH = 'bots';

export const getById = ApiTenantResource.get<IBot>(
    'bots/get',
    BOT_PATH,
);

export const getPage = ApiTenantResource.get<Page<IBot>>(
    'bots/page',
    `${BOT_PATH}/GetPage`,
);

export const deleteById = createAsyncThunk<void, { id: IBot['id'] }>(
    'bots/:id',
    ({ id }) => Axios.delete(`/scheduler/bots/${id}`),
);

export const getLogs = createAsyncThunk<string[], { id: IBot['id'], lines?: number }>(
    'bots/:id/logs',
    ({ id, lines }) => Axios.get<{ logs: string[] }>(`/scheduler/bots/${id}/logs?lines=${lines ?? 100}`)
        .then((response) => response.data.logs),
);

export const subscribeBotNotifications = ApiTenantResource
    .post<NotificationBot, CreateNotificationBotDto>
    ('bot/subscribeBotNotifications', BOT_NOTIFICATION_PATH);

export const unsubscribeBotNotifications = ApiTenantResource
    .delete<void>('bot/unsubscribeBotNotifications', BOT_NOTIFICATION_PATH);

export const getBotSubscriptionInfo = ApiTenantResource
    .get<NotificationBot[]>('bot/getBotSubscriptionInfoByBotId', `${BOT_NOTIFICATION_PATH}/bots`);
