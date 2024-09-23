import { createSlice } from '@reduxjs/toolkit';

import buildCredentialTemplatesExtraReducers from './CredentialTemplates.extraReducers';
import { CredentialTemplatesState } from './CredentialTemplates.state';
import * as credentialTemplatesThunks from './CredentialTemplates.thunks';
import { RootState } from '../../index';

const initialState: CredentialTemplatesState = {
    credentialTemplates: null,
    loading: false
};

export const slice = createSlice({
    name: 'credentialTemplates',
    initialState,
    reducers: {},
    extraReducers: buildCredentialTemplatesExtraReducers
});

export const credentialTemplatesReducer = slice.reducer;

export const credentialTemplatesSelector = (state: RootState) => state.credentialTemplates;

export const credentialTemplatesActions = {
    ...slice.actions,
    ...credentialTemplatesThunks
};
