import { createSlice } from '@reduxjs/toolkit';

import  buildCredentialAttributeExtraReducers  from './CredentialAttributes.extraReducers';
import { CredentialAttributesState } from './CredentialAttributes.state';

const initialState: CredentialAttributesState = {
    data: [],
    loading: false
};

export const slice = createSlice({
    name: 'credentialAttributes',
    initialState,
    reducers: {},
    extraReducers: buildCredentialAttributeExtraReducers
});

export const credentialAttributeReducer = slice.reducer;
