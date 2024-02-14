import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProcessCollection } from 'runbotics-common';

import URLBuilder from '#src-app/utils/URLBuilder';

import { CollectionCreateParams } from './ProcessCollection.types';

const buildCollectionPathURL = (collectionId) =>  URLBuilder
    .url('/api/process-collection-path')
    .param('collectionId', collectionId)
    .build();

export const createOne = createAsyncThunk<ProcessCollection, CollectionCreateParams, { rejectValue: any }>(
    'processCollection/createCollection',
    ({ body }, { rejectWithValue }) =>
        axios.post<ProcessCollection>('/api/process-collection', body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

export const getPath = createAsyncThunk<ProcessCollection[], string, { rejectValue: any }>(
    'processCollection/getPath',
    (collectionId, { rejectWithValue }) =>
        axios.get(buildCollectionPathURL(collectionId))
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error))
);

const processCollectionThunks = {
    createOne,
    getPath
};

export default processCollectionThunks;
