import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { UsersState } from './Users.state';
import {
    partialUpdate,
    deleteUser,
    getAllUsersInTenant,
    getAllByPage,
    getAllByPageInTenant,
    update,
    updateInTenant,
} from './Users.thunks';

// eslint-disable-next-line max-lines-per-function
const buildUsersExtraReducers = (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
        // GET PAGE FOR ADMINS
        .addCase(getAllByPage.pending, (state, action) => {

            if (
                action.meta.arg?.filter?.equals &&
                'activated' in action.meta.arg.filter.equals
            ) {
                const activatedFilter = action.meta.arg.filter.equals.activated
                    ? 'activated'
                    : 'notActivated';

                state[activatedFilter].loading = true;
            } else {
                state.loading = true;
            }
        })
        .addCase(getAllByPage.fulfilled, (state, action) => {
            if (
                action.meta.arg?.filter?.equals &&
                'activated' in action.meta.arg.filter.equals
            ) {
                const activatedFilter = action.meta.arg.filter.equals.activated
                    ? 'activated'
                    : 'notActivated';

                state[activatedFilter].allByPage = action.payload;
                state[activatedFilter].loading = false;
            } else {
                state.all = action.payload.content;
                state.loading = false;
            }
        })
        .addCase(getAllByPage.rejected, (state, action) => {
            if (
                action.meta.arg?.filter?.equals &&
                'activated' in action.meta.arg.filter.equals
            ) {
                const activatedFilter = action.meta.arg.filter.equals.activated
                    ? 'activated'
                    : 'notActivated';

                state[activatedFilter].loading = false;
            } else {
                state.loading = false;
            }
        })

        // GET PAGE FOR TENANT ADMINS
        .addCase(getAllByPageInTenant.pending, (state, action) => {
            if (
                action.meta.arg?.pageParams?.filter?.equals &&
                'activated' in action.meta.arg.pageParams.filter.equals
            ) {
                const activatedFilter = action.meta.arg.pageParams.filter.equals
                    .activated
                    ? 'tenantActivated'
                    : 'tenantNotActivated';

                state[activatedFilter].loading = true;
            } else {
                state.loading = true;
            }
        })
        .addCase(getAllByPageInTenant.fulfilled, (state, action) => {
            if (
                action.meta.arg?.pageParams?.filter?.equals &&
                'activated' in action.meta.arg.pageParams.filter.equals
            ) {
                const activatedFilter = action.meta.arg.pageParams.filter.equals
                    .activated
                    ? 'tenantActivated'
                    : 'tenantNotActivated';

                state[activatedFilter].allByPage = action.payload;
                state[activatedFilter].loading = false;
            } else {
                state.loading = false;
            }
        })
        .addCase(getAllByPageInTenant.rejected, (state, action) => {
            if (
                action.meta.arg?.pageParams?.filter?.equals &&
                'activated' in action.meta.arg.pageParams.filter.equals
            ) {
                const activatedFilter = action.meta.arg.pageParams.filter.equals
                    .activated
                    ? 'tenantActivated'
                    : 'tenantNotActivated';

                state[activatedFilter].loading = false;
            } else {
                state.loading = false;
            }
        })

        // GET ALL USERS IN TENANT
        .addCase(getAllUsersInTenant.pending, (state) => {
            state.tenantActivated.loading = true;
        })
        .addCase(getAllUsersInTenant.fulfilled, (state, action) => {
            state.tenantActivated.all = action.payload;
            state.tenantActivated.loading = false;
        })
        .addCase(getAllUsersInTenant.rejected, (state) => {
            state.tenantActivated.loading = true;
        })

        // UPDATE USERS FOR ADMIN
        .addCase(update.pending, (state) => {
            state.notActivated.loading = true;
            state.activated.loading = true;
        })
        .addCase(update.fulfilled, (state) => {
            state.notActivated.loading = false;
            state.activated.loading = false;
        })
        .addCase(update.rejected, (state) => {
            state.notActivated.loading = false;
            state.activated.loading = false;
        })

        // UPDATE USERS FOR TENANT ADMIN
        .addCase(updateInTenant.pending, (state) => {
            state.tenantActivated.loading = true;
            state.tenantNotActivated.loading = true;
        })
        .addCase(updateInTenant.fulfilled, (state) => {
            state.tenantActivated.loading = false;
            state.tenantNotActivated.loading = false;
        })
        .addCase(updateInTenant.rejected, (state) => {
            state.tenantActivated.loading = false;
            state.tenantNotActivated.loading = false;
        })

        // DELETE USER FOR ADMIN
        .addCase(deleteUser.pending, (state) => {
            state.userDelete.loading = true;
        })
        .addCase(deleteUser.fulfilled, (state) => {
            state.userDelete.loading = false;
        })
        .addCase(deleteUser.rejected, (state) => {
            state.userDelete.loading = false;
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
        });
};

export default buildUsersExtraReducers;
