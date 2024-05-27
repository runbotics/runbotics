import { createSlice } from '@reduxjs/toolkit';

import buildUsersExtraReducers from './Users.extraReducers';
import { UsersState } from './Users.state';
import * as usersThunks from './Users.thunks';
import { RootState } from '../../index';

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
        nonAdmins: {
            all: [],
            loading: false,
        }
    },
    notActivated: {
        loading: false,
        all: [],
        allByPage: null,
    },
    tenantActivated: {
        loading: false,
        all: [],
        allByPage: null,
    },
    tenantNotActivated: {
        loading: false,
        all: [],
        allByPage: null
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
