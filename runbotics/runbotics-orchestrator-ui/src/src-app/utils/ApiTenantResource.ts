import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';
import { User } from '#src-app/types/user';
import axios from '#src-app/utils/axios';

import { PageRequestParams } from './types/page';
import URLBuilder from './URLBuilder';

interface PayloadWrap<T> {
    payload?: T;
    resourceId?: string | number;
    pageParams?: PageRequestParams;
}

interface PathElements {
    resourcePath?: string;
    resourceId?: string | number;
    pageParams?: PageRequestParams;
}

type ThunkArguments = [typePrefix: string, resourcePath?: string];

class ApiTenantResource {

    static get<R, P = never>(...args: ThunkArguments) {
        return this.request<R, P>('get', ...args);
    }

    static post<R, P = never>(...args: ThunkArguments) {
        return this.request<R, P>('post', ...args);
    }

    static patch<R, P = never>(...args: ThunkArguments) {
        return this.request<R, P>('patch', ...args);
    }

    static delete<R, P = never>(...args: ThunkArguments) {
        return this.request<R, P>('delete', ...args);
    }

    private static request<ReturnType, PayloadType>(
        method: 'get' | 'post' | 'patch' | 'delete',
        typePrefix: string, resourcePath?: string
    ) {
        const asyncThunk = createAsyncThunk<ReturnType, PayloadWrap<PayloadType>, { state: RootState }>(
            typePrefix,
            ({ payload, resourceId, pageParams }, thunkApi) => {
                const { auth: { user } } = thunkApi.getState();

                const url = this.buildURL({ resourcePath, resourceId, pageParams }, user);

                return axios[method]<ReturnType>(url, payload)
                    .then(response => response.data)
                    .catch(error => thunkApi.rejectWithValue(error.response.data));
            }
        );

        return Object
            .assign((args: PayloadWrap<PayloadType> = {}) => asyncThunk(args), {
                ...asyncThunk
            });
    }

    private static buildURL(
        { resourcePath, resourceId, pageParams }: PathElements,
        user: User
    ) {
        const resourcePathPart = resourcePath
            ? `/${resourcePath}` : '';

        const resourceIdPart = resourceId
            ? `/${resourceId}` : '';

        const apiURL = `/api/scheduler/tenants/${user.tenant.id}${resourcePathPart}${resourceIdPart}`;

        return pageParams
            ? URLBuilder.url(apiURL).params(pageParams).build()
            : apiURL;
    }
};

export default ApiTenantResource;
