import { createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';
import { IProcessInstance } from 'runbotics-common';

import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

import { ProcessInstanceRequestCriteria } from './ProcessInstance.state';

const processInstancePageURL = (params: PageRequestParams<ProcessInstanceRequestCriteria>) => URLBuilder
    .url('/api/process-instances-page')
    .param('sort', 'created,desc')
    .params(params)
    .build();

export const getAll = createAsyncThunk<IProcessInstance[]>(
    'processInstances/getAll',
    () => Axios.get<IProcessInstance[]>('/api/process-instances')
        .then((response) => response.data),
);

export const getAllByProcessId = createAsyncThunk<IProcessInstance[], { processId: number }>(
    'processInstances/getAllByProcess',
    ({ processId }) => Axios.get<IProcessInstance[]>(`/api/process-instances?processId.equals=${processId}`)
        .then((response) => response.data),
);

export const getBotProcessInstances = createAsyncThunk<IProcessInstance[], { botId: number }>(
    'processInstances/getBotProcessInstances',
    ({ botId }) => Axios.get<IProcessInstance[]>(`/api/process-instances?botId.equals=${botId}`)
        .then((response) => response.data),
);

export const getProcessInstance = createAsyncThunk<IProcessInstance, {
    processInstanceId?: string;
    orchestratorProcessInstanceId?: string
}>(
    'processInstances/getBotProcessInstance',
    async ({ processInstanceId, orchestratorProcessInstanceId }) => {
        if (processInstanceId) {
            const response = await Axios.get<IProcessInstance>(`/api/process-instances/${processInstanceId}`);
            return response.data;
        }
        const response = await Axios.get<IProcessInstance[]>(
            `/api/process-instances?orchestratorProcessInstanceId.equals=${orchestratorProcessInstanceId}`,
        );
        return response.data.length > 0 ? response.data[0] : null;
    },
);

export const getSubprocesses = createAsyncThunk<IProcessInstance[], {
    processInstanceId: string;
    page: number;
    size: number;
}>(
    'processInstances/getSubprocesses',
    ({ processInstanceId, page, size }) =>
        Axios.get<IProcessInstance[]>(`/api/process-instances/${processInstanceId}/subprocesses?page=${page}&size=${size}`)
            .then((response) => response.data),
);

export const getSubprocessesCount = createAsyncThunk<number, { processInstanceId: string }>(
    'processInstances/getSubprocessesCount',
    ({ processInstanceId }) => Axios.get<number>(`/api/process-instances/${processInstanceId}/subprocesses/count`)
        .then((response) => response.data),
);

export const getProcessInstanceAndUpdatePage = createAsyncThunk<IProcessInstance, { processInstanceId?: string }>(
    'processInstances/getProcessInstanceAndUpdatePage',
    ({ processInstanceId }) => Axios.get<IProcessInstance>(`/api/process-instances/${processInstanceId}`)
        .then((response) => response.data),
);

export const getProcessInstancePage = createAsyncThunk<
    Page<IProcessInstance>,
    PageRequestParams<ProcessInstanceRequestCriteria>
>(
    'processInstances/getProcessInstancePage',
    (params) => Axios.get<Page<IProcessInstance>>(processInstancePageURL(params))
        .then((response) => response.data),
);

export const getProcessInstancePageWithSpecificInstance = createAsyncThunk<
    Page<IProcessInstance>,
    PageRequestParams<ProcessInstanceRequestCriteria> & { instanceId: string }
>(
    'processInstances/getProcessInstancePageWithSpecificInstance',
    (params) => Axios.get<Page<IProcessInstance>>(processInstancePageURL(params))
        .then((response) => response.data),
);

export const stopProcessInstance = createAsyncThunk<void, { processInstanceId: string }>(
    'processInstances/stopProcess',
    async ({ processInstanceId }) => {
        await Axios.post<void>(`/scheduler/process-instances/${processInstanceId}/stop`);
    },
);
