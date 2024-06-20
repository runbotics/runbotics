import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialCollectionsState } from './CredentialCollections.state';
import { fetchAllCredentialCollections } from './CredentialCollections.thunks';

const buildCredentialCollectionsExtraReducers = (builder: ActionReducerMapBuilder<CredentialCollectionsState>) => {
    builder.addCase(fetchAllCredentialCollections.pending, (state) => {
        state.loading = true;
    }).addCase(fetchAllCredentialCollections.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
    }).addCase(fetchAllCredentialCollections.rejected, (state) => {
        state.loading = false;
    });
};

export default buildCredentialCollectionsExtraReducers;
