import { createSlice } from '@reduxjs/toolkit';

import builderCredentialsExtraReducers from './Credentials.extraReducers';
import { CredentialsState } from './Credentials.state';
import * as credentialsThunks from './Credentials.thunks';
import { RootState } from '../../index';

const initialState: CredentialsState = {
    all: [],
    allByTemplateAndProcess: [],
    loading: false
};

const slice = createSlice({
    name: 'credentials',
    initialState,
    reducers: {},
    extraReducers: builderCredentialsExtraReducers
});

export const credentialsReducer = slice.reducer;

export const credentialsSelector = (state: RootState) => state.credentials;

export const credentialsActions = {
    ...slice.actions,
    ...credentialsThunks
};
