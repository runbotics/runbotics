import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { UsersState } from './Users.state';
import {
    getAll,
    getAllNotActivatedByPage,
    getAllActivatedByPage,
    getAllActivatedByPageAndTenant,
    getAllNotActivatedByPageAndTenant,
    updateNotActivated,
    updateActivated,
    partialUpdate,
    deleteUser,
    getActiveNonAdmins,
    updateNotActivatedByTenant,
    updateActivatedByTenant,
} from './Users.thunks';

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

        // GET ALL ACTIVATED NON-ADMINS
        .addCase(getActiveNonAdmins.pending, (state) => {
            state.activated.nonAdmins.loading = true;
        })
        .addCase(getActiveNonAdmins.fulfilled, (state, action) => {
            state.activated.nonAdmins.loading = false;
            state.activated.nonAdmins.all = action.payload;
        })
        .addCase(getActiveNonAdmins.rejected, (state) => {
            state.activated.nonAdmins.loading = false;
        })

        // GET ALL ACTIVATED BY TENANT
        .addCase(getAllActivatedByPageAndTenant.pending, (state) => {
            state.tenantActivated.loading = true;
        })
        .addCase(getAllActivatedByPageAndTenant.fulfilled, (state, action) => {
            state.tenantActivated.loading = false;
            state.tenantActivated.allByPage = { ...action.payload };
        })
        .addCase(getAllActivatedByPageAndTenant.rejected, (state) => {
            state.tenantActivated.loading = false;
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

        // GET ALL NOT ACTIVATED BY TENANT
        .addCase(getAllNotActivatedByPageAndTenant.pending, (state) => {
            state.tenantNotActivated.loading = true;
        })
        .addCase(getAllNotActivatedByPageAndTenant.fulfilled, (state, action) => {
            state.tenantNotActivated.loading = false;
            state.tenantNotActivated.allByPage = { ...action.payload };
        })
        .addCase(getAllNotActivatedByPageAndTenant.rejected, (state) => {
            state.tenantNotActivated.loading = false;
        })

        // PATCH UPDATE NOT ACTIVATED USERS
        .addCase(updateNotActivated.pending, (state) => {
            state.notActivated.loading = true;
        })
        .addCase(updateNotActivated.fulfilled, (state) => {
            state.notActivated.loading = false;
        })
        .addCase(updateNotActivated.rejected, (state) => {
            state.notActivated.loading = false;
        })

        // PATCH UPDATE ACTIVATED USERS
        .addCase(updateActivated.pending, (state) => {
            state.activated.loading = true;
        })
        .addCase(updateActivated.fulfilled, (state) => {
            state.activated.loading = false;
        })
        .addCase(updateActivated.rejected, (state) => {
            state.activated.loading = false;
        })

        // PATCH UPDATE NOT ACTIVATED USERS BY TENANT
        .addCase(updateNotActivatedByTenant.pending, (state) => {
            state.tenantNotActivated.loading = true;
        })
        .addCase(updateNotActivatedByTenant.fulfilled, (state) => {
            state.tenantNotActivated.loading = false;
        })
        .addCase(updateNotActivatedByTenant.rejected, (state) => {
            state.tenantNotActivated.loading = false;
        })

        // PATCH UPDATE ACTIVATED USERS BY TENANT
        .addCase(updateActivatedByTenant.pending, (state) => {
            state.tenantActivated.loading = true;
        })
        .addCase(updateActivatedByTenant.fulfilled, (state) => {
            state.tenantActivated.loading = false;
        })
        .addCase(updateActivatedByTenant.rejected, (state) => {
            state.tenantActivated.loading = false;
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
