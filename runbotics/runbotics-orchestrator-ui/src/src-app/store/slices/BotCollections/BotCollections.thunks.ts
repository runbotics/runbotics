import { createAsyncThunk } from '@reduxjs/toolkit';
import { IBotCollection } from 'runbotics-common';

import axios from '#src-app/utils/axios';
import { IBotCollectionWithFilters } from '#src-app/views/bot/BotCollectionView/BotCollectionView.types';

import { Page, PageRequestParams } from '../../../utils/types/page';
import URLBuilder from '../../../utils/URLBuilder';

export const getAll = createAsyncThunk<IBotCollection[], void>(
    'botCollection/getAllForUser',
    () => axios.get<IBotCollection[]>('/api/bot-collection/current-user')
        .then((response) => response.data),
);

const processPageURL = (params: PageRequestParams<Partial<IBotCollection>>) => URLBuilder
    .url('/api/bot-collection-page/current-user')
    .params(params)
    .build();

export const getByPage = createAsyncThunk<Page<IBotCollection>, PageRequestParams<Partial<IBotCollectionWithFilters>>>(
    'botCollection/getPageForUser',
    (params) => axios.get<Page<IBotCollection>>(processPageURL(params))
        .then((response) => response.data),
);

export const deleteOne = createAsyncThunk<void, { collectionId: string }>(
    'botCollection/delete',
    async ({ collectionId }) => {
        await axios.delete(`/api/bot-collection/${collectionId}`);
    },
);

interface CollectionUpdateParams {
    id: string;
    body: IBotCollection;
}

export const updateOne = createAsyncThunk<IBotCollection, CollectionUpdateParams, { rejectValue: any }>(
    'botCollection/updateCollection',
    ({ id, body }, { rejectWithValue }) =>
        axios.put<IBotCollection>(`/api/bot-collection/${id}`, body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

interface CollectionCreateParams {
    body: IBotCollection;
}

export const createOne = createAsyncThunk<IBotCollection, CollectionCreateParams, { rejectValue: any }>(
    'botCollection/createCollection',
    ({ body }, { rejectWithValue }) =>
        axios.post<IBotCollection>('/api/bot-collection', body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);
