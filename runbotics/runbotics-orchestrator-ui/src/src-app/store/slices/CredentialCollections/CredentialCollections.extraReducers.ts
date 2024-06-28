import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { BasicCredentialsCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

import { CredentialCollectionsState } from './CredentialCollections.state';
import { createCredentialCollection, deleteCredentialCollections, fetchAllCredentialCollections, findOneCredentialCollection, updateCredentialCollection } from './CredentialCollections.thunks';


const buildCredentialCollectionsExtraReducers = (builder: ActionReducerMapBuilder<CredentialCollectionsState>) => {
    builder
        .addCase(fetchAllCredentialCollections.pending, state => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialCollections.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        .addCase(fetchAllCredentialCollections.rejected, state => {
            state.loading = false;
        })
        .addCase(findOneCredentialCollection.pending, state => {
            state.loading = true;
        })
        .addCase(findOneCredentialCollection.fulfilled, (state, action) => {
            state.data = action.payload;
            state.loading = false;
        })
        .addCase(findOneCredentialCollection.rejected, state => {
            state.loading = false;
        })
        .addCase(createCredentialCollection.pending, state => {
            state.loading = true;
        })
        .addCase(createCredentialCollection.fulfilled, (state, action) => {
            state.data.push(action.payload as BasicCredentialsCollectionDto);
            state.loading = false;
        })
        .addCase(createCredentialCollection.rejected, state => {
            state.loading = false;
        })
        .addCase(updateCredentialCollection.pending, state => {
            state.loading = true;
        })
        .addCase(updateCredentialCollection.fulfilled, (state, action) => {
            const notUpdateCollections = state.data.filter(collection => collection.id !== action.payload.id);
            const collectionToUpdate = state.data.filter(collection => collection.id === action.payload.id);
            const updatedCollection = {...collectionToUpdate, ...action.payload};

            state.data = [...notUpdateCollections, updatedCollection];
            state.loading = false;
        })
        .addCase(updateCredentialCollection.rejected, state => {
            state.loading = false;
        })
        .addCase(deleteCredentialCollections.pending, state => {
            state.loading = true;
        })
        .addCase(deleteCredentialCollections.fulfilled, (state, action) => {
            state.data = state.data.filter(credentialCollection => credentialCollection.id !== action.payload);
            state.loading = false;
        })
        .addCase(deleteCredentialCollections.rejected, state => {
            state.loading = false;
        })
    ;
};

export default buildCredentialCollectionsExtraReducers;
