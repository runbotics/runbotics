import { createAsyncThunk } from '@reduxjs/toolkit';
import { IUser } from 'runbotics-common';

import axios from '#src-app/utils/axios';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';


const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getAll = createAsyncThunk<IUser[], void>(
    'users/getAll',
    () =>
        axios
            .get<IUser[]>('/api/admin/users')
            .then((response) => response.data)
);

export const getAllLimited = createAsyncThunk<IUser[], void>(
    'users/getAll',
    () =>
        axios
            .get<IUser[]>('/api/admin/users/limited')
            .then((response) => response.data)
);

export const partialUpdate = createAsyncThunk(
    'account/update',
    async (fieldsToUpdate: IUser, { rejectWithValue }) => {
        await axios
            .patch('/api/account', fieldsToUpdate)
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error.response.data));
    }
);

export const getAllActivatedByPage = createAsyncThunk<Page<IUser>, PageRequestParams>(
    'users/getAllActivatedByPage',
    (params) => axios.get<Page<IUser>>(buildPageURL(params, '/api/admin/users/activated'))
        .then((response) => response.data),
);

export const getActiveNonAdmins = createAsyncThunk<IUser[]>(
    'users/getActiveNonAdmins',
    () => axios.get<IUser[]>('/api/admin/users/non-admins')
        .then((response) => response.data),
);

export const getAllNotActivatedByPage = createAsyncThunk<Page<IUser>, PageRequestParams>(
    'users/getAllNotActivatedByPage',
    (params) => axios.get<Page<IUser>>(buildPageURL(params, '/api/admin/users/not-activated'))
        .then((response) => response.data),
);

export const getAllActivatedByPageAndTenant = createAsyncThunk<Page<IUser>, PageRequestParams>(
    'users/getAllActivatedByPageAndTenant',
    (params) => axios.get<Page<IUser>>(buildPageURL(params, '/api/admin/users/activated-tenant'))
        .then((response) => response.data),
);

export const getAllNotActivatedByPageAndTenant = createAsyncThunk<Page<IUser>, PageRequestParams>(
    'users/getAllNotActivatedByPageAndTenant',
    (params) => axios.get<Page<IUser>>(buildPageURL(params, '/api/admin/users/not-activated-tenant'))
        .then((response) => response.data),
);

export const updateNotActivated = createAsyncThunk<IUser, IUser>(
    'users/updateNotActivated',
    (user) => axios.patch<IUser>(`/api/admin/users/${user.id}`, user)
        .then((response) => response.data)
);

export const updateActivated = createAsyncThunk<IUser, IUser>(
    'users/updateActivated',
    (user, { rejectWithValue }) => axios.patch<IUser>(`/api/admin/users/${user.id}`, user)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data))
);

export const updateNotActivatedByTenant = createAsyncThunk<IUser, IUser>(
    'users/updateNotActivatedByTenant',
    (user) => axios.patch<IUser>(`/api/admin/users/tenant/${user.id}`, user)
        .then((response) => response.data)
);

export const updateActivatedByTenant = createAsyncThunk<IUser, IUser>(
    'users/updateActivatedByTenant',
    (user, { rejectWithValue }) => axios.patch<IUser>(`/api/admin/users/tenant/${user.id}`, user)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data))
);

export const deleteUser = createAsyncThunk<void, { userId: number }>(
    'users/delete',
    async ({ userId }) => {
        await axios.delete(`/api/admin/users/${userId}`);
    }
);
