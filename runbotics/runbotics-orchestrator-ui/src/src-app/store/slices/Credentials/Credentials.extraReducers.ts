import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { BasicCredentialDto } from '#src-app/views/credentials/Credential/Credential.types';

import { CredentialsState } from './Credentials.state';
import { fetchAllCredentialsInCollection, fetchAllCredentialsAccessibleInTenant, fetchOneCredential, createCredential, updateCredential, deleteCredential } from './Credentials.thunks';

const builderCredentialsExtraReducers = (builder: ActionReducerMapBuilder<CredentialsState>) => {
    builder
        // fetch all in collection
        .addCase(fetchAllCredentialsInCollection.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialsInCollection.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllCredentialsInCollection.rejected, state => {
            state.loading = false;
        })
        // fetch all user has access in tenant
        .addCase(fetchAllCredentialsAccessibleInTenant.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialsAccessibleInTenant.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllCredentialsAccessibleInTenant.rejected, state => {
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
                credential.id === action.meta.arg.resourceId ? { ...credential, ...action.meta.arg.payload} : credential
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
            state.all = state.all.filter(credential => credential.id !== action.meta.arg.resourceId);
            state.loading = false;
        })
        .addCase(deleteCredential.rejected, state => {
            state.loading = false;
        });
};

export default builderCredentialsExtraReducers;
