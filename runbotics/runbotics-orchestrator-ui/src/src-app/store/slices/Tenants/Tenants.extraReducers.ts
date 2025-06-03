import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { TenantsState } from './Tenants.state';
import {
    createOne,
    deleteOne,
    generateInviteCode,
    generateInviteCodeByTenantId,
    getAll,
    getAllByPage,
    getInviteCode,
    getInviteCodeByTenantId,
    partialUpdate,
    fetchTenantNameByInviteCode,
    TenantRawBody, 
    fetchTenantPlugins,
    createTenantPlugin,
    updateTenantPlugin,
} from './Tenants.thunks';

const buildTenantsExtraReducers = (builder: ActionReducerMapBuilder<TenantsState>) => {
    builder
        // GET ALL
        .addCase(getAll.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAll.fulfilled, (state, action) => {
            const tenants = action.payload;
            state.all = tenants.map(emailTriggerWhitelistMapper);
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
            const tenantPage = action.payload;
            state.allByPage = {
                ...tenantPage,
                content: tenantPage.content.map(emailTriggerWhitelistMapper),
            };
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
        })

        // GET INVITE CODE
        .addCase(getInviteCode.fulfilled, (state, action) => {
            state.inviteCode = action.payload.inviteCode;
        })
        .addCase(getInviteCode.rejected, (state) => {
            state.inviteCode = null;
        })
        .addCase(getInviteCodeByTenantId.fulfilled, (state, action) => {
            state.inviteCode = action.payload.inviteCode;
        })
        .addCase(getInviteCodeByTenantId.rejected, (state) => {
            state.inviteCode = null;
        })

        // GENERATE INVITE CODE
        .addCase(generateInviteCode.fulfilled, (state, action) => {
            state.inviteCode = action.payload.inviteCode;
        })
        .addCase(generateInviteCodeByTenantId.fulfilled, (state, action) => {
            state.inviteCode = action.payload.inviteCode;
        })

        // GET TENANT NAME BY INVITE CODE
        .addCase(fetchTenantNameByInviteCode.fulfilled, (state, action) => {
            state.invitingTenant = action.payload.tenantName;
        })
        .addCase(fetchTenantNameByInviteCode.rejected, (state) => {
            state.invitingTenant = null;
        })
    
        // GET TENANT PLUGINS
        .addCase(fetchTenantPlugins.pending, (state) => {
            state.plugins.all.loading = true;
            state.plugins.all.error = null;
        })
        .addCase(fetchTenantPlugins.fulfilled, (state, action) => {
            state.plugins.all.loading = false;
            state.plugins.all.error = null;
            state.plugins.all.data = action.payload;
        })
        .addCase(fetchTenantPlugins.rejected, (state, action) => {
            state.plugins.all.loading = false;
            state.plugins.all.error = action.error.message;
        })

        //ADD NEW PLUGIN LICENSE
        .addCase(createTenantPlugin.pending, (state) => {
            state.plugins.createPlugin.loading = true;
            state.plugins.createPlugin.error = null;
        })
        .addCase(createTenantPlugin.fulfilled, (state) => {
            state.plugins.createPlugin.loading = false;
            state.plugins.createPlugin.error = null;
        })
        .addCase(createTenantPlugin.rejected, (state, action) => {
            state.plugins.createPlugin.loading = true;
            state.plugins.createPlugin.error = action.error.message;
        })

        // UPDATE PLUGIN LICENSE EXPIRATION DATE
        .addCase(updateTenantPlugin.pending, (state) => {
            state.plugins.updatePlugin.loading = true;
            state.plugins.updatePlugin.error = null;
        })
        .addCase(updateTenantPlugin.fulfilled, (state) => {
            state.plugins.updatePlugin.loading = false;
            state.plugins.updatePlugin.error = null;
        })
        .addCase(updateTenantPlugin.rejected, (state, action) => {
            state.plugins.updatePlugin.loading = true;
            state.plugins.updatePlugin.error = action.error.message;
        });
};

const emailTriggerWhitelistMapper = ({ emailTriggerWhitelist, ...rest }: TenantRawBody) => ({
    ...rest,
    emailTriggerWhitelist: emailTriggerWhitelist.map(item => item.whitelistItem),
});

export default buildTenantsExtraReducers;
