import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { TenantsState } from './Tenants.state';
import { createOne, deleteOne, getAll, getAllByPage, partialUpdate } from './Tenants.thunks';

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
        })

        // CREATE ONE
        .addCase(createOne.pending, (state) => {
            state.loading = true;
        })
        .addCase(createOne.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(createOne.rejected, (state) => {
            state.loading = false;
        })

        // PARTIAL UPDATE
        .addCase(partialUpdate.pending, (state) => {
            state.loading = true;
        })
        .addCase(partialUpdate.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(partialUpdate.rejected, (state) => {
            state.loading = false;
        })

        // DELETE ONE
        .addCase(deleteOne.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteOne.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteOne.rejected, (state) => {
            state.loading = false;
        });
};

export default buildTenantsExtraReducers;
