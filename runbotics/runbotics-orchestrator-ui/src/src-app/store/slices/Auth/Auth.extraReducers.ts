import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import type { AuthState } from './Auth.state';
import { initialize, login, logout, createGuestAccount, loginWithMsalCookie } from './Auth.thunks';

const buildAuthExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
        .addCase(login.fulfilled, (state, { payload }) => {
            state.user = payload;
            state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        })

        .addCase(loginWithMsalCookie.fulfilled, (state, { payload }) => {
            state.user = payload;
            state.isAuthenticated = true;
        })
        .addCase(loginWithMsalCookie.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        })

        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(logout.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        })

        .addCase(createGuestAccount.fulfilled, (state, { payload }) => {
            state.user = payload;
            state.isAuthenticated = true;
        })
        .addCase(createGuestAccount.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        })

        .addCase(initialize.fulfilled, (state, { payload }) => {
            state.isAuthenticated = payload.isAuthenticated;
            state.user = payload.user;
            state.isInitialized = true;
        })
        .addCase(initialize.rejected, (state) => {
            state.isInitialized = false;
            state.isAuthenticated = false;
            state.user = null;
        });
};

export default buildAuthExtraReducers;
