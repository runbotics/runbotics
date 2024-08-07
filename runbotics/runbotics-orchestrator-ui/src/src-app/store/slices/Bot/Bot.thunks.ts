import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBot, NotificationBot, NotificationBotType } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import Axios from '#src-app/utils/axios';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

const BOT_NOTIFICATION_PATH = 'notifications-bot';


const botPageURL = (params: PageRequestParams<IBot>) => URLBuilder
    .url('/api/bots-page')
    .params(params)
    .build();

export const getById = createAsyncThunk<IBot, { id: IBot['id'] }>(
    'bots/get',
    ({ id }) => Axios.get<IBot>(`/api/bots/${id}`)
        .then((response) => response.data),
);

export const getAll = createAsyncThunk<IBot[], void>(
    'bots/getAll',
    () => Axios.get<IBot[]>('/api/bots')
        .then((response) => response.data),
);

export const getPage = createAsyncThunk<Page<IBot>, PageRequestParams<IBot>>(
    'bots/page',
    (params) => Axios.get<Page<IBot>>(botPageURL(params))
        .then((response) => response.data),
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
    .post<NotificationBot, { botId: number, type: NotificationBotType }>
    ('bot/subscribeBotNotifications', BOT_NOTIFICATION_PATH);

export const unsubscribeBotNotifications = ApiTenantResource
    .delete<void>('bot/unsubscribeBotNotifications', BOT_NOTIFICATION_PATH);

export const getBotSubscriptionInfo = ApiTenantResource
    .get<NotificationBot[]>('bot/getBotSubscriptionInfoByBotId', `${BOT_NOTIFICATION_PATH}/bots`);
