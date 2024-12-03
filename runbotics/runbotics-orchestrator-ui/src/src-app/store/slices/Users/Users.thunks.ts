import { createAsyncThunk } from '@reduxjs/toolkit';
import { PartialUserDto, UserDto } from 'runbotics-common';

import ApiTenantResource from '#src-app/utils/ApiTenantResource';
import axios from '#src-app/utils/axios';
import { Page, PageRequestParams } from '#src-app/utils/types/page';
import URLBuilder from '#src-app/utils/URLBuilder';


const USERS_PATH = 'users';


const buildPageURL = (params: PageRequestParams, url: string) => URLBuilder
    .url(url)
    .params(params)
    .build();

export const getAllUsersInTenant = ApiTenantResource.get<UserDto[]>(
    'users/getAllInTenant', USERS_PATH
);

export const partialUpdate = createAsyncThunk(
    'account/update',
    async (fieldsToUpdate: PartialUserDto, { rejectWithValue }) => {
        await axios
            .patch('/api/account', fieldsToUpdate)
            .then((response) => response.data)
            .catch((error) => rejectWithValue(error.response.data));
    }
);

export const getAllByPage = createAsyncThunk<Page<UserDto>, PageRequestParams>(
    'users/getAllByPage',
    (params) => axios.get<Page<UserDto>>(buildPageURL(params, '/api/scheduler/users/Page'))
        .then((response => response.data))
);

export const getAllByPageInTenant = ApiTenantResource.get<Page<UserDto>>(
    'users/getAllByPageInTenant', `${USERS_PATH}/Page`
);

export const update = createAsyncThunk<UserDto, PartialUserDto>(
    'users/update',
    (user) => axios.patch<UserDto>(`/api/scheduler/users/${user.id}`, user)
        .then((response => response.data))
);

export const updateInTenant = ApiTenantResource.patch<UserDto, PartialUserDto>(
    'users/updateInTenant', USERS_PATH
);

export const deleteUser = createAsyncThunk<
    void,
    { id: number },
    { rejectValue: { statusCode: number; message: string; } }
>('users/delete', ({ id }, { rejectWithValue }) =>
    axios
        .delete(`/api/scheduler/users/${id}`)
        .then((response) => response.data)
        .catch((error) => rejectWithValue(error.response.data))
);

export const deleteUserInTenant = ApiTenantResource.delete<void>(
    'users/deleteInTenant', USERS_PATH
);
