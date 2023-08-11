import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from 'runbotics-common';

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

export const getAllNotActivatedByPage = createAsyncThunk<Page<IUser>, PageRequestParams>(
    'users/getAllNotActivatedByPage',
    (params) => axios.get<Page<IUser>>(buildPageURL(params, '/api/admin/users/not-activated'))
        .then((response) => response.data),
);

export const updateNotActivated = createAsyncThunk<IUser, IUser>(
    'users/updateNotActivated',
    (user) => axios.patch<IUser>(`/api/admin/users/${user.id}`, user)
        .then((response) => response.data)
);

export const deleteUser = createAsyncThunk<void, { userId: number }>(
    'users/delete',
    async ({ userId }) => {
        await axios.delete(`/api/admin/users/${userId}`);
    }
);
