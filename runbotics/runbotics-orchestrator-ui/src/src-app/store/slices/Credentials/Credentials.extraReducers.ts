import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

import { CredentialsState } from './Credentials.state';
import { fetchAllCredentials, fetchOneCredential, createCredential, updateCredential, deleteCredential } from './Credentials.thunks';

const builderCredentialsExtraReducers = (builder: ActionReducerMapBuilder<CredentialsState>) => {
    builder
        // fetch all
        .addCase(fetchAllCredentials.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentials.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllCredentials.rejected, state => {
            state.loading = false;
        })
        // fetch one
        .addCase(fetchOneCredential.pending, state => {
            state.loading = true;
        })
        .addCase(fetchOneCredential.fulfilled, (state, action) => {
            state.loading = false;
            state.all = [action.payload];
        })
        .addCase(fetchOneCredential.rejected, state => {
            state.loading = false;
        })
        // create
        .addCase(createCredential.pending, state => {
            state.loading = true;
        })
        .addCase(createCredential.fulfilled, (state, action) => {
            state.all.push(action.payload as BasicCredentialDto);
            state.loading = false;
        })
        .addCase(createCredential.rejected, state => {
            state.loading = false;
        })
        // update
        .addCase(updateCredential.pending, state => {
            state.loading = true;
        })
        .addCase(updateCredential.fulfilled, (state, action) => {
            state.all = state.all.map(credential =>
                credential.id === action.payload.id ? { ...credential, ...action.payload } : credential
            );
            state.loading = false;
        })
        .addCase(updateCredential.rejected, state => {
            state.loading = false;
        })
        // delete
        .addCase(deleteCredential.pending, state => {
            state.loading = true;
        })
        .addCase(deleteCredential.fulfilled, (state, action) => {
            state.all = state.all.filter(credential => credential.id !== action.payload);
            state.loading = false;
        })
        .addCase(deleteCredential.rejected, state => {
            state.loading = false;
        });
};

export default builderCredentialsExtraReducers;
