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
            state.notActivated.loading = true;
        })
        .addCase(getAllNotActivatedByPage.fulfilled, (state, action) => {
            state.notActivated.loading = false;
            state.notActivated.allByPage = { ...action.payload };
        })
        .addCase(getAllNotActivatedByPage.rejected, (state) => {
            state.notActivated.loading = false;
        })

        // PUT ACTIVATE SELECTED
        .addCase(updateNotActivated.pending, (state) => {
            state.notActivated.loading = true;
        })
        .addCase(updateNotActivated.fulfilled, (state, action) => {
            state.notActivated.loading = false;
            state.notActivated.allByPage.content = state.notActivated.allByPage.content
                .filter((user) => user.id !== action.payload.id);
        })
        .addCase(updateNotActivated.rejected, (state) => {
            state.notActivated.loading = false;
        });
};

export default buildUsersExtraReducers;
