import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import buildTenantsExtraReducers from './Tenants.extraReducers';
import { TenantsState } from './Tenants.state';
import * as tenantsThunks from './Tenants.thunks';

const initialState: TenantsState = {
    loading: false,
    all: [],
    allByPage: null,
    inviteCode: null,
    invitingTenant: null,
    tenantPlugins: {
        loading: false,
        error: null,
        data: null,
    },
};

export const slice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {},
    extraReducers: buildTenantsExtraReducers
});

export const tenantsReducer = slice.reducer;

export const tenantsSelector = (state: RootState) => state.tenants;

export const tenantsActions = {
    ...slice.actions,
    ...tenantsThunks
};
