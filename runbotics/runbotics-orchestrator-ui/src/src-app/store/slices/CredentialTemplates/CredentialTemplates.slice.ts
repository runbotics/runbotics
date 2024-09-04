import { createSlice } from '@reduxjs/toolkit';

import buildCredentialTemplatesExtraReducers from './CredentialTemplates.extraReducers';
import { CredentialTemplatesState } from './CredentialTemplates.state';
import * as credentialTemplatesThunks from './CredentialTemplates.thunks';

const initialState: CredentialTemplatesState = {
    data: [],
    loading: false
};

export const slice = createSlice({
    name: 'credentialTemplates',
    initialState,
    reducers: {},
    extraReducers: buildCredentialTemplatesExtraReducers
});

export const credentialTemplatesReducer = slice.reducer;

export const credentialTemplatesActions = {
    ...slice.actions,
    ...credentialTemplatesThunks
};
