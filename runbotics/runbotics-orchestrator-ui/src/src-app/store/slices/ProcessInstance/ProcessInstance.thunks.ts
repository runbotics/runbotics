import { createAsyncThunk } from '@reduxjs/toolkit';
import { IProcessInstance } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import Axios from '#src-app/utils/axios';
import { Page } from '#src-app/utils/types/page';

const PROCESS_INSTANCE_PATH = 'process-instances';
const PROCESS_INSTANCE_PAGE_PATH = 'process-instances/Page';
const getSubprocessPath = (resourceId: string) =>
    `${PROCESS_INSTANCE_PATH}/${resourceId}/subprocesses/Page`;

export const getAll = ApiTenantResource
    .get<IProcessInstance[]>(
        'processInstances/getAll',
        PROCESS_INSTANCE_PATH,
    );

export const getAllByProcessId = ApiTenantResource
    .get<IProcessInstance[]>(
        'processInstances/getAllByProcessId',
        PROCESS_INSTANCE_PATH,
    );

export const getBotProcessInstances = ApiTenantResource
    .get<IProcessInstance[]>(
        'processInstances/getBotProcessInstances',
        PROCESS_INSTANCE_PATH,
    );

export const getProcessInstance = ApiTenantResource
    .get<IProcessInstance>(
        'processInstances/getProcessInstance',
        PROCESS_INSTANCE_PATH,
    );

export const getSubprocesses = ApiTenantResource
    .get<Page<IProcessInstance>>(
        'processInstances/getSubprocesses',
        getSubprocessPath,
    );

export const getProcessInstanceAndUpdatePage = ApiTenantResource
    .get<IProcessInstance>(
        'processInstances/getProcessInstanceAndUpdatePage',
        PROCESS_INSTANCE_PATH,
    );

export const getProcessInstancePage = ApiTenantResource
    .get<Page<IProcessInstance>>(
        'processInstances/getProcessInstancePage',
        PROCESS_INSTANCE_PAGE_PATH,
    );

export const getProcessInstancePageWithSpecificInstance = ApiTenantResource
    .get<Page<IProcessInstance>>(
        'processInstances/getProcessInstancePageWithSpecificInstance',
        PROCESS_INSTANCE_PAGE_PATH,
    );

export const stopProcessInstance = createAsyncThunk<void, { processInstanceId: string }>(
    'processInstances/stopProcess',
    async ({ processInstanceId }) => {
        await Axios.post<void>(`/scheduler/process-instances/${processInstanceId}/stop`);
    },
);
