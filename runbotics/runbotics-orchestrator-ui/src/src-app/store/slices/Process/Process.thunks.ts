import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

import { IProcess, Tag, NotificationProcess, IUser } from 'runbotics-common';

import { Socket } from 'socket.io-client';

import { RootState } from '#src-app/store';
import LoadingType from '#src-app/types/loading';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

import IProcessWithFilters from '#src-app/views/process/ProcessBrowseView/ProcessList/ProcessList.types';

import { StartProcessResponse, UpdateDiagramRequest } from './Process.state';


const processPageURL = (params: PageRequestParams<IProcessWithFilters>) => URLBuilder
    .url('/api/processes-page').param('sort', 'updated,desc').params(params).build();

const processPageByCollectionURL = (params: PageRequestParams<IProcessWithFilters>) => URLBuilder
    .url('/api/processes-page-collection').param('sort', 'updated,desc').params(params).build();

const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

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
            return rejectWithValue(error.response);
        });
});

export const fetchGuestDemoProcess = createAsyncThunk<IProcess>(
    'processes/guestDemo',
    () => Axios.get<IProcess>('/api/guests/process')
        .then((response) => response.data),
);

export const partialUpdateProcess = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/partialUpdate',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateProcess = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/update',
    (process, { rejectWithValue }) => Axios.put(`/api/processes/${process.id}`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateBotCollection = createAsyncThunk<IProcess, IProcess, { rejectValue: any }>(
    'processes/bot-collection',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/bot-collection`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateAttendance = createAsyncThunk<IProcess, Pick<IProcess, 'id' | 'isAttended'>, { rejectValue: any }>(
    'processes/updateAttended',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/is-attended`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateTriggerable = createAsyncThunk<IProcess, Pick<IProcess, 'id' | 'isTriggerable'>, { rejectValue: any }>(
    'processes/updateTriggerable',
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

export const updateProcessOutputType = createAsyncThunk<IProcess, Pick<IProcess, 'id' | 'outputType'>, { rejectValue: any }>(
    'processes/output-type',
    (process, { rejectWithValue }) => Axios.patch(`/api/processes/${process.id}/output-type`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const updateDiagram = createAsyncThunk<IProcess, UpdateDiagramRequest, { rejectValue: any }>(
    'processes/updateDiagram',
    (process, { rejectWithValue }) => Axios.patch<IProcess>(`/api/processes/${process.id}/diagram`, process)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const createProcess = createAsyncThunk<IProcess, IProcess>(
    'processes/create',
    (processInfo, { rejectWithValue }) => Axios.post<IProcess>('/api/processes', processInfo)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data)),
);

export const createGuestProcess = createAsyncThunk<IProcess>(
    'processes/create',
    () => Axios.post<IProcess>('/api/processes/guest')
        .then((response) => response.data)
        .catch((error) => {
            throw error;
        }),
);

export const startProcess = createAsyncThunk<StartProcessResponse, { processId: IProcess['id'], clientId: Socket['id'], executionInfo?: Record<string, any> }>(
    'processes/startProcess',
    ({ processId, clientId, executionInfo }, thunkAPI) => Axios.post<StartProcessResponse>(`/scheduler/processes/${processId}/start`, { clientId, variables: executionInfo })
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

export const getProcessesPageByCollection = createAsyncThunk<Page<IProcess>, PageRequestParams<IProcessWithFilters>>(
    'processes/getPageByCollection',
    (params) => Axios.get<Page<IProcess>>(processPageByCollectionURL(params)).then((response) => response.data)
);

export const deleteProcess = createAsyncThunk<void, { processId: number }>(
    'processes/delete',
    async ({ processId }) => {
        await Axios.delete(`/api/processes/${processId}`);
    },
);

export const getTagsByName = createAsyncThunk<Tag[], PageRequestParams>(
    'tags/getByName',
    (params) => Axios.get<Tag[]>(buildPageURL(params, '/api/tags'))
        .then((response) => response.data)
);

export const subscribeProcessNotifications = createAsyncThunk<NotificationProcess, { processId: IProcess['id']; userId: IUser['id'] }>(
    'processes/subscribeProcessNotifications',
    (userProcess) => Axios.post<NotificationProcess>('/api/process-notifications', userProcess)
        .then((response) => response.data)
);

export const unsubscribeProcessNotifications = createAsyncThunk<void, NotificationProcess['id']>(
    'processes/unsubscribeProcessNotifications',
    (notificationId) => Axios.delete(`/api/process-notifications/${notificationId}`)
);

export const getProcessSubscriptionInfo = createAsyncThunk<NotificationProcess[], IProcess['id']>(
    'processes/getProcessSubscriptionInfo',
    (processId) => Axios.get<NotificationProcess[]>(`/api/processes/${processId}/notifications`)
        .then((response) => response.data)
);

export const getProcessSubscriptionInfoByProcessIdAndUserId = createAsyncThunk<NotificationProcess, { processId: IProcess['id']; userId: IUser['id'] }>(
    'processes/getProcessSubscriptionInfoByProcessIdAndUserId',
    ({ processId, userId }) => Axios.get<NotificationProcess>(`/api/process-notifications?processId=${processId}&userId=${userId}`)
        .then((response) => response.data)
);
