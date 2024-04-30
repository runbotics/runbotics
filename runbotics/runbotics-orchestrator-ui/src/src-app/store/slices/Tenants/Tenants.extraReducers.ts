import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { TenantsState } from './Tenants.state';
import { getAll } from './Tenants.thunks';

const buildTenantsExtraReducers = (builder: ActionReducerMapBuilder<TenantsState>) => {
    builder
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.all = action.payload;
            state.loading = false;
        })
        .addCase(getAll.rejected, (state) => {
            state.loading = false;
        });
};

export default buildTenantsExtraReducers;
