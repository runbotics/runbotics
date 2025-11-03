import { createAsyncThunk } from '@reduxjs/toolkit';

import {
    ActionBlacklist,
    CreateNotificationProcessDto,
    IProcess,
    NotificationProcess,
    PatchWebhookProcessTrigger,
    ProcessCredentialDto,
    ProcessDto,
    Tag,
} from 'runbotics-common';

import { Socket } from 'socket.io-client';

import { AppDispatch, RootState } from '#src-app/store';
import LoadingType from '#src-app/types/loading';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import Axios from '#src-app/utils/axios';
import { Page } from '#src-app/utils/types/page';

import {
    CreateProcessCredentialDto,
    StartProcessResponse,
    UpdateDiagramRequest,
} from './Process.state';

const PROCESS_NOTIFICATION_PATH = 'notifications-process';
const TAGS_PATH = 'tags';
const PROCESSES_PATH = 'processes';
const PROCESS_CREDENTIALS_PATH = 'process-credentials';

const getProcessById = ApiTenantResource.get<IProcess[]>(
    'processes/getById',
    PROCESSES_PATH
);

export const fetchProcessById = createAsyncThunk<
    ProcessDto,
    number,
    {
        state: RootState;
        requestId: string;
        rejectValue: any;
        dispatch: AppDispatch;
    }
>(
    'processes/fetchById',
    async (processId, { getState, requestId, dispatch, rejectWithValue }) => {
        const { currentRequestId, loading } = getState().process.draft;

        if (loading !== LoadingType.PENDING || requestId !== currentRequestId) {
            return rejectWithValue(undefined);
        }

        const result = await dispatch(
            getProcessById({ resourceId: processId })
        );

        if (getProcessById.rejected.match(result)) {
            return rejectWithValue(result.payload);
        }

        return result.payload as ProcessDto;
    }
);

export const fetchGuestDemoProcess = ApiTenantResource.get<ProcessDto>(
    'processes/guestDemo',
    `${PROCESSES_PATH}/guest`
);

export const updateProcess = ApiTenantResource.patch<IProcess, IProcess>(
    'processes/update',
    PROCESSES_PATH
);

export const updateExecutionInfo = ApiTenantResource.patch<
    IProcess,
    Pick<IProcess, 'executionInfo'>
>(
    'processes/execution-info',
    (id: string) => `${PROCESSES_PATH}/${id}/execution-info`
);

export const updateBotCollection = ApiTenantResource.patch<
    IProcess,
    Pick<IProcess, 'botCollection'>
>(
    'processes/bot-collection',
    (id: string) => `${PROCESSES_PATH}/${id}/bot-collection`
);

export const updateAttendance = ApiTenantResource.patch<
    void,
    Pick<IProcess, 'isAttended'>
>(
    'processes/updateAttended',
    (id: string) => `${PROCESSES_PATH}/${id}/is-attended`
);

export const updateTriggerable = ApiTenantResource.patch<
    void,
    Pick<IProcess, 'isTriggerable'>
>(
    'processes/updateTriggerable',
    (id: string) => `${PROCESSES_PATH}/${id}/is-triggerable`
);

export const updateBotSystem = ApiTenantResource.patch<
    IProcess,
    Pick<IProcess, 'system'>
>(
    'processes/updateBotSystem',
    (id: string) => `${PROCESSES_PATH}/${id}/bot-system`
);

export const updateProcessOutputType = ApiTenantResource.patch<
    void,
    Pick<IProcess, 'output'>
>(
    'processes/output-type',
    (id: string) => `${PROCESSES_PATH}/${id}/output-type`
);

export const updateDiagram = ApiTenantResource.patch<
    IProcess,
    UpdateDiagramRequest
>('processes/updateDiagram', (id: string) => `${PROCESSES_PATH}/${id}/diagram`);

export const createProcess = ApiTenantResource.post<ProcessDto, ProcessDto>(
    'processes/createProcess',
    PROCESSES_PATH
);

export const createGuestProcess = ApiTenantResource.post<IProcess>(
    'processes/createGuestProcess',
    `${PROCESSES_PATH}/guest`
);

export const startProcess = createAsyncThunk<
    StartProcessResponse,
    {
        processId: IProcess['id'];
        clientId: Socket['id'];
        executionInfo?: Record<string, any>;
    }
>(
    'processes/startProcess',
    ({ processId, clientId, executionInfo }, thunkAPI) =>
        Axios.post<StartProcessResponse>(
            `/scheduler/processes/${processId}/start`,
            {
                clientId,
                variables: executionInfo,
            }
        )
            .then((response) => response.data)
            .catch((error) => {
                const message =
                    error.response.status === 504
                        ? { message: 'Process start failed' }
                        : error.response.data;

                return thunkAPI.rejectWithValue(message);
            })
);

export const setDraft = createAsyncThunk(
    'api/setDraft',
    (payload: { process: ProcessDto }) => payload.process
);

export const getProcesses = ApiTenantResource.get<ProcessDto[]>(
    'process/getAll',
    PROCESSES_PATH
);

export const getSimplifiedProcesses = ApiTenantResource.get<ProcessDto[]>(
    'processes/simplified',
    `${PROCESSES_PATH}/simplified`
);

export const getProcessesPage = ApiTenantResource.get<Page<ProcessDto>>(
    'process/getPage',
    `${PROCESSES_PATH}/GetPage`
);

export const getProcessesAllPage = ApiTenantResource.get<Page<ProcessDto>>(
    'process/getPage',
    `${PROCESSES_PATH}/GetAllPage`
);

export const deleteProcess = ApiTenantResource.delete<number>(
    'process/delete',
    PROCESSES_PATH
);

export const getTagsByName = ApiTenantResource.get<Tag[]>(
    'tags/getByName',
    TAGS_PATH
);

export const subscribeProcessNotifications = ApiTenantResource.post<
    NotificationProcess,
    CreateNotificationProcessDto
>('processes/subscribeProcessNotifications', PROCESS_NOTIFICATION_PATH);

export const unsubscribeProcessNotifications = ApiTenantResource.delete<void>(
    'processes/unsubscribeProcessNotifications',
    PROCESS_NOTIFICATION_PATH
);

export const getProcessSubscriptionInfo = ApiTenantResource.get<
    NotificationProcess[]
>(
    'processes/getProcessSubscriptionInfo',
    `${PROCESS_NOTIFICATION_PATH}/processes`
);

export const getProcessCredentials = ApiTenantResource.get<
    ProcessCredentialDto[]
>('processes/getProcessCredentials', `${PROCESS_CREDENTIALS_PATH}/processes`);

export const createProcessCredential = ApiTenantResource.post<
    void,
    CreateProcessCredentialDto
>('processes/deleteProcessCredential', PROCESS_CREDENTIALS_PATH);

export const deleteProcessCredential = ApiTenantResource.delete<void>(
    'processes/deleteProcessCredential',
    PROCESS_CREDENTIALS_PATH
);

export const getBlacklistedActions = ApiTenantResource.get<ActionBlacklist>(
    'action-blacklist/current',
    'action-blacklist/current'
);

export const addWebhook = ApiTenantResource.patch<IProcess, PatchWebhookProcessTrigger>(
    'process/add-webhook',
    (id: string) => `${PROCESSES_PATH}/${id}/add-webhook`,
);

export const deleteWebhook = ApiTenantResource.patch<IProcess, PatchWebhookProcessTrigger>(
    'process/delete-webhook',
    (id: string) => `${PROCESSES_PATH}/${id}/delete-webhook`
);
