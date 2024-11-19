import { createSlice, Dictionary } from '@reduxjs/toolkit';

import { UserDto } from 'runbotics-common';

import extraAuthReducers from './Auth.extraReducers';
import * as authThunks from './Auth.thunks';

interface AuthState {
    isAuthenticated: boolean;
    user: UserDto & { authoritiesById?: Dictionary<any>; } | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
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
