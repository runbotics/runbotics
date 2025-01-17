import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProcessCollection } from 'runbotics-common';

import { RootState } from '#src-app/store';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import axios from '#src-app/utils/axios';
import { PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

import { CollectionCreateParams, CollectionDeleteParams, CollectionUpdateParams, ProcessCollectionPack } from './ProcessCollection.types';

const buildCollectionURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

// export const getWithAccess = createAsyncThunk<void, PageRequestParams, { rejectValue: any }>(
//     'processCollection/getWithAccess',
//     (params, { rejectWithValue }) =>
//         axios.get(buildCollectionURL(params, '/api/process-collection/access'))
//             .then((response) => response.data)
//             .catch((error) => rejectWithValue(error))
// );

const PROCESS_COLLECTION_PATH = 'process-collection';

export const getWithAccess = ApiTenantResource.get<ProcessCollection>(
    'processCollection/getWithAccess',
    `${PROCESS_COLLECTION_PATH}/access`
);

// export const getAllWithAncestors = ApiTenantResource.get<{ childrenCollections: ProcessCollection[], breadcrumbs?: ProcessCollection[] }>(
//     'processCollection/getAllWithAncestors',
//     PROCESS_COLLECTION_PATH
// );
export const getAllWithAncestors = createAsyncThunk<ProcessCollectionPack, PageRequestParams, { state: RootState; }
>('processCollection/getAllWithAncestors', (params, { getState }) => {
    const { auth: { user } } = getState();
    return axios.get(buildCollectionURL(params, `/api/scheduler/tenants/${user.tenant.id}/${PROCESS_COLLECTION_PATH}`))
        .then((response) => response.data);
});

// export const getAllWithAncestors = createAsyncThunk<ProcessCollectionPack, PageRequestParams, { rejectValue: any }>(
//     'processCollection/getAllWithAncestors',
//     (params, { rejectWithValue }) =>
//         axios.get(buildCollectionURL(params, `/api/scheduler/${PROCESS_COLLECTION_PATH}`))
//             .then((response) => response.data)
//             .catch((error) => rejectWithValue(error))
// );

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
