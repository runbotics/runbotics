import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserDto } from 'runbotics-common';

import axios from '#src-app/utils/axios';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';


const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getAll = createAsyncThunk<UserDto[], void>(
    'users/getAll',
    () =>
        axios
            .get<UserDto[]>('/api/admin/users')
            .then((response) => response.data)
);

export const getAllLimited = createAsyncThunk<UserDto[], void>(
    'users/getAll',
    () =>
        axios
            .get<UserDto[]>('/api/admin/users/limited')
            .then((response) => response.data)
);

export const partialUpdate = createAsyncThunk(
    'account/update',
    async (fieldsToUpdate: UserDto, { rejectWithValue }) => {
        await axios
            .patch('/api/account', fieldsToUpdate)
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error.response.data));
    }
);

export const getAllActivatedByPage = createAsyncThunk<Page<UserDto>, PageRequestParams>(
    'users/getAllActivatedByPage',
    (params) => axios.get<Page<UserDto>>(buildPageURL(params, '/api/admin/users/activated'))
        .then((response) => response.data),
);

export const getActiveNonAdmins = createAsyncThunk<UserDto[]>(
    'users/getActiveNonAdmins',
    () => axios.get<UserDto[]>('/api/admin/users/non-admins')
        .then((response) => response.data),
);

export const getAllNotActivatedByPage = createAsyncThunk<Page<UserDto>, PageRequestParams>(
    'users/getAllNotActivatedByPage',
    (params) => axios.get<Page<UserDto>>(buildPageURL(params, '/api/admin/users/not-activated'))
        .then((response) => response.data),
);

export const getAllActivatedByPageAndTenant = createAsyncThunk<Page<UserDto>, PageRequestParams>(
    'users/getAllActivatedByPageAndTenant',
    (params) => axios.get<Page<UserDto>>(buildPageURL(params, '/api/admin/users/activated-tenant'))
        .then((response) => response.data),
);

export const getAllNotActivatedByPageAndTenant = createAsyncThunk<Page<UserDto>, PageRequestParams>(
    'users/getAllNotActivatedByPageAndTenant',
    (params) => axios.get<Page<UserDto>>(buildPageURL(params, '/api/admin/users/not-activated-tenant'))
        .then((response) => response.data),
);

export const updateNotActivated = createAsyncThunk<UserDto, UserDto>(
    'users/updateNotActivated',
    (user) => axios.patch<UserDto>(`/api/admin/users/${user.id}`, user)
        .then((response) => response.data)
);

export const updateActivated = createAsyncThunk<UserDto, UserDto>(
    'users/updateActivated',
    (user, { rejectWithValue }) => axios.patch<UserDto>(`/api/admin/users/${user.id}`, user)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data))
);

export const updateNotActivatedByTenant = createAsyncThunk<UserDto, UserDto>(
    'users/updateNotActivatedByTenant',
    (user) => axios.patch<UserDto>(`/api/admin/users/tenant/${user.id}`, user)
        .then((response) => response.data)
);

export const updateActivatedByTenant = createAsyncThunk<UserDto, UserDto>(
    'users/updateActivatedByTenant',
    (user, { rejectWithValue }) => axios.patch<UserDto>(`/api/admin/users/tenant/${user.id}`, user)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data))
);

export const deleteUser = createAsyncThunk<void, { userId: number }>(
    'users/delete',
    async ({ userId }) => {
        await axios.delete(`/api/admin/users/${userId}`);
    }
);
