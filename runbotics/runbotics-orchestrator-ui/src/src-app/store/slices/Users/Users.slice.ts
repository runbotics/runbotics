import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../index';
import buildUsersExtraReducers from './Users.extraReducers';
import { UsersState } from './Users.state';
import * as usersThunks from './Users.thunks';

const initialState: UsersState = {
    all: [],
    loading: false,
    userUpdate: {
        loading: false
    },
    userDelete: {
        loading: false
    },
    activated: {
        loading: false,
        all: [],
        allByPage: null,
    },
    notActivated: {
        loading: false,
        all: [],
        allByPage: null,
    }
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
