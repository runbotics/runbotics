import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProcessCollection } from 'runbotics-common';

import { CollectionCreateParams } from './ProcessCollection.types';

export const createOne = createAsyncThunk<ProcessCollection, CollectionCreateParams, { rejectValue: any }>(
    'processCollection/createCollection',
    ({ body }, { rejectWithValue }) =>
        axios.post<ProcessCollection>('/api/process-collection', body)
            .then((response) => response.data)
            .catch(error => rejectWithValue(error))
);

const processCollectionThunks = {
    createOne,
};

export default processCollectionThunks;
