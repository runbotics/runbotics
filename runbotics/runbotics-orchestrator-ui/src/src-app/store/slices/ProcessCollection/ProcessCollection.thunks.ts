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

const PROCESS_COLLECTION_PATH = 'process-collection';
const SCHEDULER_API_PATH = '/api/scheduler/tenants';

export const getWithAccess = ApiTenantResource.get<ProcessCollection>(
    'processCollection/getWithAccess',
    `${PROCESS_COLLECTION_PATH}/access`
);

export const getAllWithAncestors = createAsyncThunk<ProcessCollectionPack, PageRequestParams, { state: RootState; }
>('processCollection/getAllWithAncestors', (params, { getState }) => {
    const { auth: { user } } = getState();
    return axios.get(buildCollectionURL(params, `${SCHEDULER_API_PATH}/${user.tenant.id}/${PROCESS_COLLECTION_PATH}`))
        .then((response) => response.data);
});

export const createOne = createAsyncThunk<ProcessCollection, CollectionCreateParams, { state: RootState }>(
    'processCollection/createCollection',
    ({ body }, { getState }) => {
        const { description, ...bodyWithoutDescription } = body;
        const correctBody = { ...bodyWithoutDescription, ...(description && { description }) };
        const { auth: { user } } = getState();
        return axios.post<ProcessCollection>(`${SCHEDULER_API_PATH}/${user.tenant.id}/${PROCESS_COLLECTION_PATH}`, correctBody)
            .then((response) => response.data);
    });

export const getAllAccessible = ApiTenantResource.get<ProcessCollection[]>(
    'processCollection/getAccessible',
    `${PROCESS_COLLECTION_PATH}/user-accessible`
);

export const updateOne = createAsyncThunk<ProcessCollection, CollectionUpdateParams, { state: RootState }>(
    'processCollection/createCollection/{id}',
    ({ id, body }, { getState }) => {
        const { description, ...bodyWithoutDescription } = body;
        const correctBody = { ...bodyWithoutDescription, ...(description && { description }) };
        const { auth: { user } } = getState();
        return axios.put<ProcessCollection>(`${SCHEDULER_API_PATH}/${user.tenant.id}/${PROCESS_COLLECTION_PATH}/${id}`, correctBody)
            .then((response) => response.data);
    }
);

export const deleteOne = createAsyncThunk<ProcessCollection, CollectionDeleteParams, { state: RootState }>(
    'processCollection/deleteCollection/{id}',
    ({ id }, {  getState }) => {
        const { auth: { user } } = getState();
        return axios.delete<ProcessCollection>(`${SCHEDULER_API_PATH}/${user.tenant.id}/${PROCESS_COLLECTION_PATH}/${id}`)
            .then((response) => response.data);
    }
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
