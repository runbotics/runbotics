import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

import { IProcess } from 'runbotics-common';


import { RootState } from '#src-app/store';
import LoadingType from '#src-app/types/loading';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

import IProcessWithFilters from '#src-app/views/process/ProcessBrowseView/ProcessList/ProcessList.types';

import { StartProcessResponse } from './Process.state';


const processPageURL = (params: PageRequestParams<IProcess>) => URLBuilder
    .url('/api/processes-page').param('sort', 'updated,desc').params(params).build();

export const fetchProcessById = createAsyncThunk<
    IProcess,
    number,
    {
        state: RootState;
        requestId: string;
        rejectValue: any;
    }
>('processes/fetchById', (processId, { getState, requestId, rejectWithValue }) => {
    const { currentRequestId, loading } = getState().process.draft;
    if (loading !== LoadingType.PENDING || requestId !== currentRequestId) { return; }

    // eslint-disable-next-line consistent-return
    return Axios.get<IProcess>(`/api/processes/${processId}`)
        .then((response) => response.data)
        .catch((error) => {
            if (!error.response) { throw error; }

            // We got validation errors, let's return those so we can reference in our component and set form errors
            return rejectWithValue(error.response.data);
        });
});

export const partialUpdateProcess = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/partialUpdate',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateBotCollection = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/bot-collection',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/bot-collection`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateAttendedance = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/is-attended',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/is-attended`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateTriggerable = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/is-triggerable',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/is-triggerable`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateBotSystem = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/bot-system',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/bot-system`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const saveProcess = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/save',
    (process, { rejectWithValue }) => Axios.put<IProcess>(`/api/processes/${process.id}`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const createProcess = createAsyncThunk<IProcess, IProcess>(
    'processes/create',
    (processInfo) =>
        Axios.post<IProcess>('/api/processes', processInfo)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            }),
);

export const startProcess = createAsyncThunk<StartProcessResponse, { processId: IProcess['id'], executionInfo?: Record<string, any> }>(
    'processes/startProcess',
    ({ processId, executionInfo }, thunkAPI) => Axios.post<StartProcessResponse>(`/scheduler/processes/${processId}/start`, { variables: executionInfo })
        .then((response) => response.data)
        .catch((error) => {
            const message = error.response.status === 504 ? { message: 'Process start failed' } : error.response.data;
            return thunkAPI.rejectWithValue(message);
        }),
);

export const setDraft = createAsyncThunk('api/setDraft', (payload: { process: IProcess }) => payload.process);

export const getProcesses = createAsyncThunk<IProcess[]>('processes/getAll', () => Axios.get<IProcess[]>('/api/processes').then((response) => response.data));

export const getProcessesPage = createAsyncThunk<Page<IProcess>, PageRequestParams<IProcessWithFilters>>(
    'processes/getPage',
    (params) => Axios.get<Page<IProcess>>(processPageURL(params)).then((response) => response.data),
);

export const deleteProcess = createAsyncThunk<void, { processId: number }>(
    'processes/delete',
    async ({ processId }) => {
        await Axios.delete(`/api/processes/${processId}`);
    },
);

export const isProcessAvailable = createAsyncThunk<void, { processName: string }>(
    'processes/name/is-available',
    ({ processName }) =>
        Axios.get<void>(`/api/processes/name/${processName}/is-available`)
            .then((response) => response.data),
);
