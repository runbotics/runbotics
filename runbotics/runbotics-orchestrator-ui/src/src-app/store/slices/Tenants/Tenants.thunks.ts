import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tenant, TenantInviteCode } from 'runbotics-common';

import APIResource from '#src-app/utils/APIResource';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getAll = APIResource
    .get<Tenant[], null>('tenants/getAll');

// TODO: change to scheduler after endpoint will be ready
export const getAllByPage = createAsyncThunk<Page<Tenant>, PageRequestParams>(
    'tenants/getAllByPage',
    (params) => axios.get<Page<Tenant>>(buildPageURL(params, '/api/admin/tenants/all-page'))
        .then(response => response.data)
);

export const createOne = APIResource
    .post<Tenant, Tenant>('tenants/create');

export const partialUpdate = APIResource
    .patch<Tenant, Tenant>('tenants/partialUpdate');

export const deleteOne = createAsyncThunk<void, number>(
    'tenants/delete',
    (id) => axios.delete(`/api/admin/tenants/${id}`)
);

export const getInviteCode = APIResource
    .get<TenantInviteCode, null>('tenants/getInviteCode', 'invite-code');

export const generateInviteCode = APIResource
    .post<TenantInviteCode, null>('tenants/generateInviteCode', 'invite-code');
