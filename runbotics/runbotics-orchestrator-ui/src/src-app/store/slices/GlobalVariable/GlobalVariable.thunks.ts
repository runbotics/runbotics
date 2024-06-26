import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

import { RootState } from '#src-app/store';
import { IGlobalVariable } from '#src-app/types/model/global-variable.model';

export const getGlobalVariables = createAsyncThunk<IGlobalVariable[], void, { state: RootState }>(
    'globalVariables/getGlobalVariables',
    async () => {
        const response = await Axios.get('/api/global-variables');
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
