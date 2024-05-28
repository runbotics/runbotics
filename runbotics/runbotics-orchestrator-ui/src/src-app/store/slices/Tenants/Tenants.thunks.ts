import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tenant, TenantInviteCode } from 'runbotics-common';

import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getAll = createAsyncThunk<Tenant[], void>(
    'tenants/getAll',
    () => axios.get<Tenant[]>('/api/admin/tenants/all')
        .then(response => response.data)
);

export const getAllByPage = createAsyncThunk<Page<Tenant>, PageRequestParams>(
    'tenants/getAllByPage',
    (params) => axios.get<Page<Tenant>>(buildPageURL(params, '/api/admin/tenants/all-page'))
        .then(response => response.data)
);

export const createOne = createAsyncThunk<Tenant, Tenant>(
    'tenants/create',
    (tenant) => axios.post<Tenant>('/api/admin/tenants', tenant)
        .then(response => response.data)
);

export const partialUpdate = createAsyncThunk<Tenant, Tenant>(
    'tenants/partialUpdate',
    (tenant, { rejectWithValue }) => axios.patch<Tenant>(`/api/admin/tenants/${tenant.id}`, tenant)
        .then(response => response.data)
        .catch(error => rejectWithValue(error.response.data))
);

export const deleteOne = createAsyncThunk<void, number>(
    'tenants/delete',
    (id) => axios.delete(`/api/admin/tenants/${id}`)
);

export const getInviteCode = createAsyncThunk<TenantInviteCode, void>(
    'tenants/getInviteCode',
    () => axios.get('/api/tenant/tenants/invite-code')
        .then(response => response.data)
);
