import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

import { RootState } from '#src-app/store';
import { IGlobalVariable } from '#src-app/types/model/global-variable.model';
import { PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getGlobalVariables = createAsyncThunk<IGlobalVariable[], PageRequestParams, { state: RootState }>(
    'globalVariables/getGlobalVariables',
    async (params) => {
        const response = await Axios.get(buildPageURL(params, '/api/global-variables'));
        return response.data;
    },
);

export const createGlobalVariable = createAsyncThunk<IGlobalVariable,
    { globalVariable: IGlobalVariable },
    { state: RootState }>(
        'globalVariables/createGlobalVariable',
        async ({ globalVariable }) => {
            const response = await Axios.post('/api/global-variables', globalVariable);
            return response.data;
        },
    );

export const updateGlobalVariable = createAsyncThunk<IGlobalVariable,
    { globalVariable: IGlobalVariable },
    { state: RootState }>(
        'globalVariables/updateGlobalVariable',
        async ({ globalVariable }) => {
            const response = await Axios.put(`/api/global-variables/${globalVariable.id}`, globalVariable);
            return response.data;
        },
    );

export const deleteGlobalVariable = createAsyncThunk<string[], { id: number }, { state: RootState }>(
    'globalVariables/deleteGlobalVariable',
    ({ id }, { rejectWithValue }) => Axios.delete(`/api/global-variables/${id}`)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);
