import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../index';
import * as usersThunks from './Users.thunks';
import { UsersState } from './Users.state';
import buildUsersExtraReducers from './Users.extraReducers';

const initialState: UsersState = {
    loading: false,
    all: [],
};

export const slice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: buildUsersExtraReducers,
});

export const usersReducer = slice.reducer;

export const usersSelector = (state: RootState) => state.users;

export const usersActions = {
    ...slice.actions,
    ...usersThunks,
};