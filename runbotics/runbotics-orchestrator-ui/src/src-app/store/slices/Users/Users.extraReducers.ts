import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { UsersState } from './Users.state';
import { getAll, getAllNotActivatedByPage, updateNotActivated, partialUpdate } from './Users.thunks';

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
        .addCase(partialUpdate.pending, (state) => {
            state.userUpdate.loading = true;
        })
        .addCase(partialUpdate.fulfilled, (state) => {
            state.userUpdate.loading = false;
        })
        .addCase(partialUpdate.rejected, (state) => {
            state.userUpdate.loading = false;
        })

        // GET ALL NOT ACTIVATED
        .addCase(getAllNotActivatedByPage.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllNotActivatedByPage.fulfilled, (state, action) => {
            state.loading = false;
            state.allNotActivatedByPage = action.payload;
        })
        .addCase(getAllNotActivatedByPage.rejected, (state) => {
            state.loading = false;
        })

        // PUT ACTIVATE SELECTED
        .addCase(updateNotActivated.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateNotActivated.fulfilled, (state, action) => {
            state.loading = false;
            state.allNotActivatedByPage.content = state.allNotActivatedByPage.content.filter((user) => user.id !== action.payload.id);
        })
        .addCase(updateNotActivated.rejected, (state) => {
            state.loading = false;
        });
};

export default buildUsersExtraReducers;
