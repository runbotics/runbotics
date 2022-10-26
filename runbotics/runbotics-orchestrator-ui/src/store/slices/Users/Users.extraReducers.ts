import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { getAll } from './Users.thunks';
import { UsersState } from './Users.state';

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
        });
};

export default buildUsersExtraReducers;
