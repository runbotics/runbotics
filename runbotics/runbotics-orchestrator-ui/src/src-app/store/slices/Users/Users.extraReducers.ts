import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { UsersState } from './Users.state';
import { getAll, partialAccountUpdate } from './Users.thunks';

const buildUsersExtraReducers = (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
        // GET ALL
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            state.loading = false;
            state.all = action.payload;
        })
        .addCase(getAll.rejected, (state) => {
            state.loading = false;
        })

        // PARTIAL ACCOUNT UPDATE
        .addCase(partialAccountUpdate.pending, (state) => {
            state.loading = true;
        })
        .addCase(partialAccountUpdate.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(partialAccountUpdate.rejected, (state) => {
            state.loading = false;
        });
};

export default buildUsersExtraReducers;
