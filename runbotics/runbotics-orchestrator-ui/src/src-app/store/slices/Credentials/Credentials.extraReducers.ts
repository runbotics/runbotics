import { ActionReducerMapBuilder } from '@reduxjs/toolkit';


import { CredentialsState } from './Credentials.state';
import { fetchAllCredentialsInCollection, fetchAllCredentialsAccessibleInTenant, fetchOneCredential, createCredential, updateCredential, deleteCredential, updateAttribute, fetchAllCredentialsByTemplateAndProcess } from './Credentials.thunks';

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

        // fetch all accessible credentials in tenant
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

        // fetch all accessible credentials in tenant by template and process
        .addCase(fetchAllCredentialsByTemplateAndProcess.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialsByTemplateAndProcess.fulfilled, (state, action) => {
            state.loading = false;
            state.allByTemplateAndProcess = action.payload;
        })
        .addCase(fetchAllCredentialsByTemplateAndProcess.rejected, state => {
            state.loading = false;
        })

        // fetch one credential
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

        // create credential
        .addCase(createCredential.pending, state => {
            state.loading = true;
        })
        .addCase(createCredential.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createCredential.rejected, state => {
            state.loading = false;
        })

        // update credential
        .addCase(updateCredential.pending, state => {
            state.loading = true;
        })
        .addCase(updateCredential.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateCredential.rejected, state => {
            state.loading = false;
        })

        // update credential attribute
        .addCase(updateAttribute.pending, state => {
            state.loading = true;
        })
        .addCase(updateAttribute.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateAttribute.rejected, state => {
            state.loading = false;
        })

        // delete credential
        .addCase(deleteCredential.pending, state => {
            state.loading = true;
        })
        .addCase(deleteCredential.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteCredential.rejected, state => {
            state.loading = false;
        });
};

export default builderCredentialsExtraReducers;
