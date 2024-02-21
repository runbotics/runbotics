import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProcessCollection } from 'runbotics-common';

import { CollectionCreateParams, CollectionUpdateParams } from './ProcessCollection.types';

export const createOne = createAsyncThunk<ProcessCollection, CollectionCreateParams, { rejectValue: any }>(
    'processCollection/createCollection',
    ({ body }, { rejectWithValue }) =>
        axios.post<ProcessCollection>('/api/process-collection', body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

export const updateOne = createAsyncThunk<ProcessCollection, CollectionUpdateParams, { rejectValue: any }>(
    'processCollection/createCollection/{id}',
    ({ id, body }, { rejectWithValue }) =>
        axios.put<ProcessCollection>(`/api/process-collection/${id}`, body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

export const getAllAccessible = createAsyncThunk<ProcessCollection[]>(
    'processCollection/getAccessible/',
    (_, { rejectWithValue }) => axios.get<ProcessCollection[]>('/api/process-collection/user-accessible/')
        .then((response) => response.data)
        .catch(error => rejectWithValue(error))
);

const processCollectionThunks = {
    createOne,
    updateOne,
    getAllAccessible
};

export default processCollectionThunks;
