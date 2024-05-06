import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { TenantsState } from './Tenants.state';
import { getAll, getAllByPage } from './Tenants.thunks';

const buildTenantsExtraReducers = (builder: ActionReducerMapBuilder<TenantsState>) => {
    builder
        // GET ALL
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.all = action.payload;
            state.loading = false;
        })
        .addCase(getAll.rejected, (state) => {
            state.loading = false;
        })

        // GET ALL BY PAGE
        .addCase(getAllByPage.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllByPage.fulfilled, (state, action) => {
            state.allByPage = action.payload;
            state.loading = false;
        })
        .addCase(getAllByPage.rejected, (state) => {
            state.loading = false;
        });
};

export default buildTenantsExtraReducers;
