import { createSlice } from '@reduxjs/toolkit';

import { User } from '#src-app/types/user';

import extraAuthReducers from './Auth.extraReducers';
import * as authThunks from './Auth.thunks';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isInitialised: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: extraAuthReducers,
});

export const authReducer = slice.reducer;

export const authActions = {
    ...slice.actions,
    ...authThunks,
};
