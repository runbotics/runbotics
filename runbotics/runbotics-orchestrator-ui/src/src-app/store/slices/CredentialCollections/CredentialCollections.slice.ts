import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '#src-app/store';

import buildCredentialCollectionsExtraReducers from './CredentialCollections.extraReducers';
import { CredentialCollectionsState } from './CredentialCollections.state';
import * as credentialCollectionThunks from './CredentialCollections.thunks';

const initialState: CredentialCollectionsState = {
    credentialCollections: [],
    loading: false,
};

const slice = createSlice({
    name: 'credentialCollections',
    initialState,
    reducers: {},
    extraReducers: buildCredentialCollectionsExtraReducers
});

export const credentialCollectionsReducer = slice.reducer;

export const credentialCollectionsSelector = (state: RootState) => state.credentialCollections;

export const credentialCollectionsActions = {
    ...slice.actions,
    ...credentialCollectionThunks
};
