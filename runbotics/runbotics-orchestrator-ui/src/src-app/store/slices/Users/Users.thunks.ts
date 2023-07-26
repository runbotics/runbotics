import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from 'runbotics-common';

import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';

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

const processPageURL = (params: PageRequestParams) => URLBuilder
    .url('/api/admin/users/not-activated')
    .params(params)
    .build();

export const getAllNotActivatedByPage = createAsyncThunk<Page<IUser>, PageRequestParams>(
    'users/getAllNotActivatedByPage',
    (params) => axios.get<Page<IUser>>(processPageURL(params))
        .then((response) => response.data),
);

export const updateNotActivated = createAsyncThunk<IUser, IUser>(
    'users/updateNotActivated',
    (params) => axios.put<IUser>('/api/admin/users', params)
        .then((response) => response.data)
);
