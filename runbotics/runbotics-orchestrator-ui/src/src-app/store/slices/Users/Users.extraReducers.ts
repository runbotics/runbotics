import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { UsersState } from './Users.state';
import { getAll, getAllNotActivatedByPage, getAllActivatedByPage, updateNotActivated, partialUpdate, deleteUser } from './Users.thunks';

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

        // GET ALL ACTIVATED
        .addCase(getAllActivatedByPage.pending, (state) => {
            state.activated.loading = true;
        })
        .addCase(getAllActivatedByPage.fulfilled, (state, action) => {
            state.activated.loading = false;
            state.activated.allByPage = { ...action.payload };
        })
        .addCase(getAllActivatedByPage.rejected, (state) => {
            state.activated.loading = false;
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
        .addCase(updateNotActivated.fulfilled, (state) => {
            state.notActivated.loading = false;
        })
        .addCase(updateNotActivated.rejected, (state) => {
            state.notActivated.loading = false;
        })

        // DELETE USER
        .addCase(deleteUser.pending, (state) => {
            state.userDelete.loading = true;
        })
        .addCase(deleteUser.fulfilled, (state) => {
            state.userDelete.loading = false;
        })
        .addCase(deleteUser.rejected, (state) => {
            state.userDelete.loading = false;
        });
};

export default buildUsersExtraReducers;
