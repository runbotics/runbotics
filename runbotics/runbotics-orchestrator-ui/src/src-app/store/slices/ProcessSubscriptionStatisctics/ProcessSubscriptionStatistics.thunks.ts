import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '#src-app/store';
import ApiTenantResource from '#src-app/utils/ApiTenantResource';

import { ProcessNotificationSubscriber } from './ProcessSubscriptionStatistics.state';

const PROCESS_SUBSCRIPTION_STATISTICS_PATH = 'process-summary-notification-subscribers';

export const getSubscribers = ApiTenantResource.get<ProcessNotificationSubscriber[]>(
    'statistics/getAll',
    PROCESS_SUBSCRIPTION_STATISTICS_PATH
);

export const getSubscribersBaseInformation = ApiTenantResource.get<ProcessNotificationSubscriber[]>(
    'statistics/getAllBaseInformation',
    `${PROCESS_SUBSCRIPTION_STATISTICS_PATH}/base-information`
);

export const getSubscribersByProcessId = ApiTenantResource.get<ProcessNotificationSubscriber[]>(
    'statistics/getByProcessId',
    (processId: number) => `${PROCESS_SUBSCRIPTION_STATISTICS_PATH}/processes/${processId}`
);

export const postSubscriber = ApiTenantResource.post<ProcessNotificationSubscriber, { customEmail?: string; processId: number }>(
    'statistics/createSubscriber',
    PROCESS_SUBSCRIPTION_STATISTICS_PATH
);

export const patchSubscriber = ApiTenantResource.patch<ProcessNotificationSubscriber, Partial<ProcessNotificationSubscriber>>(
    'statistics/updateSubscriber',
    (id: string) => `${PROCESS_SUBSCRIPTION_STATISTICS_PATH}/${id}`
);

export const deleteSubscriberApi = ApiTenantResource.delete<void>(
    'statistics/deleteSubscriber',
    (id: string) => `${PROCESS_SUBSCRIPTION_STATISTICS_PATH}/${id}`
);

export const fetchSubscribers = createAsyncThunk<
    ProcessNotificationSubscriber[],
    void,
    { state: RootState; rejectValue: string; dispatch: AppDispatch }
>(
    'statistics/fetchSubscribers',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const thunk = getSubscribers();
            const result = await dispatch(thunk);
            return unwrapResult(result);
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch subscribers.');
        }
    }
);

export const fetchSubscribersBaseInformation = createAsyncThunk<
    ProcessNotificationSubscriber[],
    void,
    { state: RootState; rejectValue: string; dispatch: AppDispatch }
>(
    'statistics/fetchSubscribersBaseInformation',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const thunk = getSubscribersBaseInformation();
            const result = await dispatch(thunk);
            return unwrapResult(result);
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch base information.');
        }
    }
);

export const fetchSubscribersByProcessId = createAsyncThunk<
    ProcessNotificationSubscriber[],
    number,
    { state: RootState; rejectValue: string; dispatch: AppDispatch }
>(
    'statistics/fetchSubscribersByProcessId',
    async (processId, { dispatch, rejectWithValue }) => {
        try {
            const thunk = getSubscribersByProcessId({ resourceId: processId });
            const result = await dispatch(thunk);
            return unwrapResult(result);
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch subscribers by process ID.');
        }
    }
);

export const createSubscriber = createAsyncThunk<
    ProcessNotificationSubscriber,
    { customEmail?: string; processId: number, userId: number },
    { state: RootState; rejectValue: string; dispatch: AppDispatch }
>(
    'statistics/createSubscriber',
    async (data, { dispatch, rejectWithValue }) => {
        try {
            const thunk = postSubscriber({ payload: data });
            const result = await dispatch(thunk);
            return unwrapResult(result);
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to create subscriber.');
        }
    }
);

export const updateSubscriber = createAsyncThunk<
    ProcessNotificationSubscriber,
    { id: string; update: Partial<ProcessNotificationSubscriber> },
    { state: RootState; rejectValue: string; dispatch: AppDispatch }
>(
    'statistics/updateSubscriber',
    async ({ id, update }, { dispatch, rejectWithValue }) => {
        try {
            const thunk = patchSubscriber({ resourceId: id, payload: update });
            const result = await dispatch(thunk);
            return unwrapResult(result);
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to update subscriber.');
        }
    }
);

export const deleteSubscriber = createAsyncThunk<
    void,
    string,
    { state: RootState; rejectValue: string; dispatch: AppDispatch }
>(
    'statistics/deleteSubscriber',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const thunk = deleteSubscriberApi({ resourceId: id });
            const result = await dispatch(thunk);
            return unwrapResult(result);
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to delete subscriber.');
        }
    }
);
