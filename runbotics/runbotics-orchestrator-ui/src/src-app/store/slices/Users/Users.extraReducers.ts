import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { PayloadWrap } from '#src-app/utils/ApiTenantResource';
import { PageRequestParams } from '#src-app/utils/types/page';

import { UsersState } from './Users.state';
import {
    partialUpdate,
    deleteUser,
    getAllUsersInTenant,
    getAllByPage,
    getAllByPageInTenant,
    update,
    updateInTenant,
    deleteUserInTenant,
} from './Users.thunks';

const getActionAdminFilterContext = (
    action: PayloadAction<unknown, string,
        { arg: PageRequestParams<any>; }, never>
) => {
    if (
        action.meta.arg?.filter?.equals &&
        'activated' in action.meta.arg.filter.equals
    ) {
        return action.meta.arg.filter.equals.activated
            ? 'activated'
            : 'notActivated';
    }
    return undefined;
};

const getActionTenantAdminFilterContext = (
    action: PayloadAction<unknown, string,
        { arg: PayloadWrap<never>; }, never>
) => {
    if (
        action.meta.arg?.pageParams?.filter?.equals &&
        'activated' in action.meta.arg.pageParams.filter.equals
    ) {
        return action.meta.arg.pageParams.filter.equals
            .activated
            ? 'tenantActivated'
            : 'tenantNotActivated';
    }
    return undefined;
};

// eslint-disable-next-line max-lines-per-function
const buildUsersExtraReducers = (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
        // GET PAGE FOR ADMINS
        .addCase(getAllByPage.pending, (state, action) => {
            const activatedFilter = getActionAdminFilterContext(action);

            if (activatedFilter) state[activatedFilter].loading = true;
            else state.loading = true;
        })
        .addCase(getAllByPage.fulfilled, (state, action) => {
            const activatedFilter = getActionAdminFilterContext(action);

            if (activatedFilter) {
                state[activatedFilter].allByPage = action.payload;
                state[activatedFilter].loading = false;
            } else {
                state.all = action.payload.content;
                state.loading = false;
            }
        })
        .addCase(getAllByPage.rejected, (state, action) => {
            const activatedFilter = getActionAdminFilterContext(action);

            if (activatedFilter) state[activatedFilter].loading = false;
            else state.loading = false;
        })

        // GET PAGE FOR TENANT ADMINS
        .addCase(getAllByPageInTenant.pending, (state, action) => {
            const activatedFilter = getActionTenantAdminFilterContext(action);

            if (activatedFilter) state[activatedFilter].loading = true;
            else state.loading = true;
        })
        .addCase(getAllByPageInTenant.fulfilled, (state, action) => {
            const activatedFilter = getActionTenantAdminFilterContext(action);

            if (activatedFilter) {
                state[activatedFilter].allByPage = action.payload;
                state[activatedFilter].loading = false;
            } else {
                state.loading = false;
            }
        })
        .addCase(getAllByPageInTenant.rejected, (state, action) => {
            const activatedFilter = getActionTenantAdminFilterContext(action);

            if (activatedFilter) state[activatedFilter].loading = false;
            else state.loading = false;
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

        // DELETE USER FOR TENANT ADMIN
        .addCase(deleteUserInTenant.pending, (state) => {
            state.userDelete.loading = true;
        })
        .addCase(deleteUserInTenant.fulfilled, (state) => {
            state.userDelete.loading = false;
        })
        .addCase(deleteUserInTenant.rejected, (state) => {
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
