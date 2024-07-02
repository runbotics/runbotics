import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Role } from 'runbotics-common';

import { hasRoleAccess } from '#src-app/components/utils/Secured';
import { RootState } from '#src-app/store';
import { User } from '#src-app/types/user';

import { PageRequestParams } from './types/page';
import URLBuilder from './URLBuilder';

interface PayloadWrap<T> {
    payload?: T;
    resourceId?: string;
    pageParams?: PageRequestParams;
}

interface PathElements {
    resourcePath?: string;
    resourceId?: string;
    pageParams?: PageRequestParams;
}

class APIResource {

    static get<ReturnType, PayloadType>(
        typePrefix: string, resourcePath?: string
    ): AsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }> {
        return createAsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }>(
            typePrefix,
            ({ payload, resourceId, pageParams }, thunkApi) => {
                const { auth: { user } } = thunkApi.getState();

                const url = this.buildURL({ resourcePath, resourceId, pageParams }, user);

                return axios.get<ReturnType>(url, payload)
                    .then(response => response.data)
                    .catch(error => thunkApi.rejectWithValue(error.response.data));
            }
        );
    }

    static post<ReturnType, PayloadType>(
        typePrefix: string, resourcePath?: string
    ): AsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }> {
        return createAsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }>(
            typePrefix,
            ({ payload, resourceId }, thunkApi) => {
                const { auth: { user } } = thunkApi.getState();

                const url = this.buildURL({ resourcePath, resourceId }, user);

                return axios.post<ReturnType>(url, payload)
                    .then(response => response.data)
                    .catch(error => thunkApi.rejectWithValue(error.response.data));
            }
        );
    }

    static patch<ReturnType, PayloadType>(
        typePrefix: string, resourcePath?: string
    ): AsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }> {
        return createAsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }>(
            typePrefix,
            ({ payload, resourceId }, thunkApi) => {
                const { auth: { user } } = thunkApi.getState();

                const url = this.buildURL({ resourcePath, resourceId }, user);

                return axios.patch<ReturnType>(url, payload)
                    .then(response => response.data)
                    .catch(error => thunkApi.rejectWithValue(error.response.data));
            }
        );
    }

    static delete<ReturnType, PayloadType>(
        typePrefix: string, resourcePath?: string
    ): AsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }> {
        return createAsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }>(
            typePrefix,
            ({ payload, resourceId }, thunkApi) => {
                const { auth: { user } } = thunkApi.getState();

                const url = this.buildURL({ resourcePath, resourceId }, user);

                return axios.delete<ReturnType>(url, payload)
                    .then(response => response.data)
                    .catch(error => thunkApi.rejectWithValue(error.response.data));
            }
        );
    }

    private static buildURL(
        { resourcePath, resourceId, pageParams }: PathElements,
        user: User
    ) {
        const resourcePathPart = resourcePath
            ? `/${resourcePath}` : '';

        const resourceIdPart = resourceId
            ? `/${resourceId}` : '';

        const apiURL = hasRoleAccess(user, [Role.ROLE_ADMIN])
            ? `/api/scheduler/tenants${resourcePathPart}${resourceIdPart}`
            : `/api/scheduler/tenants/${user.tenant.id}${resourcePathPart}${resourceIdPart}`;

        return pageParams
            ? URLBuilder.url(apiURL).params(pageParams).build()
            : apiURL;
    }
};

export default APIResource;
