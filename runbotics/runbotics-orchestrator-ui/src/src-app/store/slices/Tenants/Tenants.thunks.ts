import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tenant } from 'runbotics-common';

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
