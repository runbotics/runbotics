import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialsState } from './Credentials.state';
import { fetchAllCredentialsAccessibleInTenant } from './Credentials.thunks';

const builderCredentialsExtraReducers = (builder: ActionReducerMapBuilder<CredentialsState>) => {
    builder
        .addCase(fetchAllCredentialsAccessibleInTenant.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchAllCredentialsAccessibleInTenant.fulfilled, (state, action) => {
            state.all = action.payload;
            state.loading = false;
        })
        .addCase(fetchAllCredentialsAccessibleInTenant.rejected, (state) => {
            state.all = [];
            state.loading = false;
        });
};

export default builderCredentialsExtraReducers;
