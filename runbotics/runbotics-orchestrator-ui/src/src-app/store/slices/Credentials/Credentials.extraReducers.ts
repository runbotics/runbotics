import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialsState } from './Credentials.state';
import { fetchAllCredentials } from './Credentials.thunks';

const builderCredentialsExtraReducers = (builder: ActionReducerMapBuilder<CredentialsState>) => {
    builder
        .addCase(fetchAllCredentials.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllCredentials.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(fetchAllCredentials.rejected, (state) => {
            state.loading = false;
        });
};

export default builderCredentialsExtraReducers;
