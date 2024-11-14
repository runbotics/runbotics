import { ActionReducerMapBuilder } from '@reduxjs/toolkit';


import { CredentialCollectionsState } from './CredentialCollections.state';
import {
    createCredentialCollection,
    deleteCredentialCollections,
    fetchAllCredentialCollections,
    fetchAllCredentialCollectionsByPage,
    fetchOneCredentialCollection,
    updateCredentialCollection
} from './CredentialCollections.thunks';

const buildCredentialCollectionsExtraReducers = (builder: ActionReducerMapBuilder<CredentialCollectionsState>) => {
    builder
        // fetch all
        .addCase(fetchAllCredentialCollections.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialCollections.fulfilled, (state, action) => {
            state.credentialCollections = action.payload;
            state.loading = false;
        })
        .addCase(fetchAllCredentialCollections.rejected, state => {
            state.loading = false;
        })

        // fetch all by page
        .addCase(fetchAllCredentialCollectionsByPage.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialCollectionsByPage.fulfilled, (state, action) => {
            state.allCredentialCollectionsByPage = action.payload;
            state.loading = false;
        })
        .addCase(fetchAllCredentialCollectionsByPage.rejected, state => {
            state.loading = false;
        })

        // fetch one
        .addCase(fetchOneCredentialCollection.pending, state => {
            state.loading = true;
        })
        .addCase(fetchOneCredentialCollection.fulfilled, (state, action) => {
            state.credentialCollections = [action.payload];
            state.loading = false;
        })
        .addCase(fetchOneCredentialCollection.rejected, state => {
            state.loading = false;
        })

        // create
        .addCase(createCredentialCollection.pending, state => {
            state.loading = true;
        })
        .addCase(createCredentialCollection.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createCredentialCollection.rejected, state => {
            state.loading = false;
        })

        // update
        .addCase(updateCredentialCollection.pending, state => {
            state.loading = true;
        })
        .addCase(updateCredentialCollection.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(updateCredentialCollection.rejected, state => {
            state.loading = false;
        })

        // delete
        .addCase(deleteCredentialCollections.pending, state => {
            state.loading = true;
        })
        .addCase(deleteCredentialCollections.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteCredentialCollections.rejected, state => {
            state.loading = false;
        });
};

export default buildCredentialCollectionsExtraReducers;
