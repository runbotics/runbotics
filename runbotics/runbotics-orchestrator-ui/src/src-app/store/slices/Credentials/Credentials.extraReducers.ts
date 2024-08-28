import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { CredentialsState } from './Credentials.state';
import { getAllForProcessAndTemplate } from './Credentials.thunks';

const builderCredentialsExtraReducers = (builder: ActionReducerMapBuilder<CredentialsState>) => {
    builder
        .addCase(getAllForProcessAndTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllForProcessAndTemplate.fulfilled, (state, action) => {
            state.all = action.payload;
            state.loading = false;
        })
        .addCase(getAllForProcessAndTemplate.rejected, (state) => {
            state.all = [];
            state.loading = false;
        });
};

export default builderCredentialsExtraReducers;
