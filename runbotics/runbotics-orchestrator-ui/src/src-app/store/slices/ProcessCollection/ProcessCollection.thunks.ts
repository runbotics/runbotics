import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProcessCollection } from 'runbotics-common';

import axios from '#src-app/utils/axios';
import { PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

import { CollectionCreateParams, CollectionDeleteParams, CollectionUpdateParams, ProcessCollectionPack } from './ProcessCollection.types';

const buildCollectionURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getWithAccess = createAsyncThunk<void, PageRequestParams, { rejectValue: any }>(
    'processCollection/getWithAccess',
    (params, { rejectWithValue }) =>
        axios.get(buildCollectionURL(params, '/api/process-collection/access'))
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error))
);

export const getAllWithAncestors = createAsyncThunk<ProcessCollectionPack, PageRequestParams, { rejectValue: any }>(
    'processCollection/getAllWithAncestors',
    (params, { rejectWithValue }) =>
        axios.get(buildCollectionURL(params, '/api/process-collection'))
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error))
);

export const createOne = createAsyncThunk<ProcessCollection, CollectionCreateParams, { rejectValue: any }>(
    'processCollection/createCollection',
    ({ body, parentId }, { rejectWithValue }) =>
        axios.post<ProcessCollection>('/api/process-collection', body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

export const getAllAccessible = createAsyncThunk<ProcessCollection[]>(
    'processCollection/getAccessible/',
    (_, { rejectWithValue }) => axios.get<ProcessCollection[]>('/api/process-collection/user-accessible/')
        .then((response) => response.data)
        .catch(error => rejectWithValue(error))
);

export const updateOne = createAsyncThunk<ProcessCollection, CollectionUpdateParams, { rejectValue: any }>(
    'processCollection/createCollection/{id}',
    ({ id, body, parentId }, { rejectWithValue }) =>
        axios.put<ProcessCollection>(`/api/process-collection/${id}`, body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

export const deleteOne = createAsyncThunk<ProcessCollection, CollectionDeleteParams, { rejectValue: any }>(
    'processCollection/deleteCollection/{id}',
    ({ id }, { rejectWithValue }) =>
        axios.delete<ProcessCollection>(`/api/process-collection/${id}`)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

const processCollectionThunks = {
    getWithAccess,
    getAllWithAncestors,
    createOne,
    updateOne,
    deleteOne,
    getAllAccessible
};

export default processCollectionThunks;
