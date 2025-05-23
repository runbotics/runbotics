import { createAsyncThunk } from '@reduxjs/toolkit';
import { Tenant, TenantInviteCode, TenantPlugin } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import axios from '#src-app/utils/axios';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';
import { PluginFormData } from '#src-app/views/tenants/TenantsListView/TenantPluginsDrawer/TenantPluginsEdit/TenantPluginsEdit';

export type TenantRawBody = Omit<Tenant, 'emailTriggerWhitelist'> & {
    emailTriggerWhitelist: {
        id: string;
        tenantId: string;
        whitelistItem: string;
    }[];
}

const INVITE_CODE_PATH = 'invite-code';

const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getAll = createAsyncThunk<TenantRawBody[]>(
    'tenants/getAll',
    () => axios.get<TenantRawBody[]>('/api/scheduler/tenants')
        .then(response => response.data)
);

export const getAllByPage = createAsyncThunk<Page<TenantRawBody>, PageRequestParams>(
    'tenants/getAllByPage',
    (params) => axios.get<Page<TenantRawBody>>(buildPageURL(params, '/api/scheduler/tenants/Page'))
        .then(response => response.data)
);

export const createOne = createAsyncThunk<TenantRawBody, Tenant>(
    'tenants/create',
    (tenant) => axios.post<TenantRawBody>('/api/scheduler/tenants', tenant)
        .then(response => response.data)
);

export const partialUpdate = createAsyncThunk<TenantRawBody, Tenant>(
    'tenants/partialUpdate',
    (tenant, { rejectWithValue }) => axios.patch<TenantRawBody>(`/api/scheduler/tenants/${tenant.id}`, tenant)
        .then(response => response.data)
        .catch(error => rejectWithValue(error.response.data))
);

export const deleteOne = createAsyncThunk<void, number>(
    'tenants/delete',
    (id, { rejectWithValue }) => axios.delete(`/api/scheduler/tenants/${id}`)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data))
);

export const getInviteCode = ApiTenantResource
    .get<TenantInviteCode>('tenants/getInviteCode', INVITE_CODE_PATH);

export const getInviteCodeByTenantId = createAsyncThunk<TenantInviteCode, string>(
    'tenants/getInviteCodeByTenantId',
    (id) => axios.get<TenantInviteCode>(`/api/scheduler/tenants/invite-code/${id}`)
        .then(response => response.data)
);

export const generateInviteCode = ApiTenantResource
    .post<TenantInviteCode>('tenants/generateInviteCode', INVITE_CODE_PATH);

export const generateInviteCodeByTenantId = createAsyncThunk<TenantInviteCode, string>(
    'tenants/generateInviteCodeByTenantId',
    (id) => axios.post<TenantInviteCode>(`/api/scheduler/tenants/invite-code/${id}`)
        .then(response => response.data)
);

export const fetchTenantNameByInviteCode = createAsyncThunk<{ tenantName: string }, string>(
    'tenants/fetchTenantNameByInviteCode',
    (inviteCode, { rejectWithValue }) =>
        axios.post<{ tenantName: string }>('/api/scheduler/tenants/invite-code', { inviteCode })
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error.response.data))
);

export const fetchTenantPlugins = createAsyncThunk<TenantPlugin[], string>(
    'tenants/fetchTenantPlugins',
    async (tenantId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/scheduler/tenants/${tenantId}/licenses`);
            const plugins = response.data.map((plugin: any) => ({
                ...plugin,
                expDate: plugin.expDate ? new Date(plugin.expDate).toISOString() : null,
            }));
            return plugins;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createTenantPlugin = createAsyncThunk<TenantPlugin, PluginFormData>(
    'tenants/createTenantPlugin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/scheduler/licenses', data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTenantPlugin = createAsyncThunk<TenantPlugin, PluginFormData>(
    'tenants/updateTenantPlugin',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`/api/scheduler/licenses/${data.id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
