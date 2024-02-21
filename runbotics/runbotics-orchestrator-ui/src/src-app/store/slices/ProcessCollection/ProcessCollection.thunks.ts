import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProcessCollection } from 'runbotics-common';

import { PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

import { CollectionCreateParams } from './ProcessCollection.types';

const buildCollectionPathURL = (collectionId) => URLBuilder
    .url('/api/process-collection/active/ancestors')
    .param('collectionId', collectionId)
    .build();

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

export const getAll = createAsyncThunk<ProcessCollection[], PageRequestParams, { rejectValue: any }>(
    'processCollection/getAll',
    (params, { rejectWithValue }) =>
        axios.get(buildCollectionURL(params, '/api/process-collection'))
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error))
);

export const createOne = createAsyncThunk<ProcessCollection, CollectionCreateParams, { rejectValue: any }>(
    'processCollection/createCollection',
    ({ body }, { rejectWithValue }) =>
        axios.post<ProcessCollection>('/api/process-collection', body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

export const getAncestors = createAsyncThunk<ProcessCollection[], string>(
    'processCollection/getAncestors',
    (collectionId) =>
        axios.get(buildCollectionPathURL(collectionId))
            .then((response) => response.data)
);

const processCollectionThunks = {
    getWithAccess,
    getAll,
    createOne,
    getAncestors
};

export default processCollectionThunks;
