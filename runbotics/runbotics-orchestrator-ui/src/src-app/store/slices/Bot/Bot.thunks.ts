import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { IBot } from 'runbotics-common';

import { IProcess } from '#src-app/types/model/process.model';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

const botPageURL = (params: PageRequestParams<IProcess>) => URLBuilder
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
